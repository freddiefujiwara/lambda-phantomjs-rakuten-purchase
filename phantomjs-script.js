var env = {};
var steps=[];
var stepIndex = 0;
var loadInProgress = false;//This is set to true when a page is still loading
var webPage = require('webpage');
var page = webPage.create();

/*********CONFIGURATION*********************/
page.settings.userAgent = 'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19';
page.settings.javascriptEnabled = true;
page.settings.loadImages = false;//Script is much faster with this field set to false
phantom.cookiesEnabled = true;
phantom.javascriptEnabled = true;
env.username = "";
env.password = "";
env.product_url ="http://product.rakuten.co.jp/product/-/9810409b2cdcbafe78d4d6ff3d82b8ba/";
/*********CONFIGURATION*****************/

console.log('All settings loaded, start with execution');
page.onConsoleMessage = function(msg) {
    console.log(msg);
};
steps = [
    function(env){
        console.log('Step 1 - Open RakutenIchiba top page');
        page.open("http://www.rakuten.co.jp/", function(status){
            console.log(status);
        },env);
    },
    function(env){
        console.log('Step 2 - Click on the Sign in button');
        page.evaluate(function(env){
            document.getElementById("loginBtn").firstChild.click();
        },env);
    },
    function(env){
        console.log('Step 3 - Populate and submit the login form '+env.username);
        page.evaluate(function(env){
            document.getElementById("username").value=env.username;
            document.getElementById("password").value=env.password;
            document.getElementsByName("submit")[0].click();
        },env);
    },
    function(env){
        console.log('Step 5 - Go to product page ' + env.product_url);
        page.open(env.product_url, function(status){
            console.log(status);
        },env);
    },
    function(env){
        console.log('Step 6 - Click on the Min Priced Item Link');
        page.evaluate(function(env){
            document.getElementsByClassName("shopAreaLink")[0].click();
        },env);
    },
    function(env){
        console.log('Step 7 - Change to PC mode');
        page.evaluate(function(env){
            document.getElementById("displayModeLink").children[0].click();
        },env);
    },
    function(env){
        console.log('Step 8 - Click on the Cart in button');
        page.evaluate(function(env){
            document.getElementById("rakutenLimitedId_aroundCart").childNodes[1].childNodes[1].submit();
        },env);
    },
    function(env){
        console.log('Step 9 - Next Step in the Basket');
        page.evaluate(function(env){
            var units = document.getElementsByName("units")[0];
            units.value=1;
            units.setAttribute("data-selected-value",1);
            document.getElementsByClassName("order-button")[0].click();
        },env);
    },
    function(env){
        console.log('Step 10 - Populate and submit the login form '+env.username);
        page.evaluate(function(env){
            document.getElementById("u").value=env.username;
            document.getElementById("p").value=env.password;
            document.getElementById("login_button").click();
            document.getElementById("login").submit();
        },env);
    },
    function(env){
        console.log('Step 11 - Purchase');
        page.evaluate(function(env){
            document.getElementById("ml_clr").click();
            //            document.getElementById("purchase-button-bottom").click();
        },env);
    },
    function(env){
        var fs = require('fs');
        var result = page.evaluate(function(env) {
            return document.querySelectorAll("html")[0].outerHTML;
        },env);
        fs.write('RakutenIchibaLoggedIn.html',result,'w');
    },
];

//Execute steps one by one
interval = setInterval(function(){
    if (loadInProgress == false && typeof steps[stepIndex] == "function") {
        //console.log("step " + (stepIndex + 1));
        steps[stepIndex](env);
        stepIndex++;
    }
    if (typeof steps[stepIndex] != "function") {
        console.log("test complete!");
        phantom.exit();
    }
},200);
page.onLoadStarted = function() {
    loadInProgress = true;
    console.log('Loading started');
};
page.onLoadFinished = function() {
    loadInProgress = false;
    console.log('Loading finished');
};
page.onConsoleMessage = function(msg) {
    console.log(msg);
};
