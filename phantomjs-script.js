var webPage = require('webpage');
var system  = require('system');
var page = webPage.create();
var stepIndex = 0;

/*********CONFIGURATION*********************/
page.settings.userAgent = 'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19';
page.settings.javascriptEnabled = true;
page.settings.loadImages = false;//Script is much faster with this field set to false
phantom.cookiesEnabled = true;
phantom.javascriptEnabled = true;
/*********CONFIGURATION*****************/

var steps = [
    function(env){
        console.log('Step ' + env.stepIndex + ' Open RakutenIchiba top page');
        page.open("http://www.rakuten.co.jp/", function(status){
            console.log(status);
        },env);
    },
    function(env){
        console.log('Step ' + env.stepIndex + ' click on the sign in button');
        page.evaluate(function(env){
            document.getElementById("loginBtn").firstChild.click();
        },env);
    },
    function(env){
        console.log('Step ' + env.stepIndex + ' submit the login form '+env.username);
        page.evaluate(function(env){
            document.getElementById("username").value=env.username;
            document.getElementById("password").value=env.password;
            document.getElementsByName("submit")[0].click();
        },env);
    },
    function(env){
        console.log('Step ' + env.stepIndex + ' go to product page ' + env.product_url);
        page.open(env.product_url, function(status){
            console.log(status);
        },env);
    },
    function(env){
        console.log('Step ' + env.stepIndex + ' click on the purchase button');
        page.evaluate(function(env){
            document.getElementById("pdt_overview").firstChild.click();
        },env);
    },
    function(env){
        console.log('Step ' + env.stepIndex + ' go to the next step in the Basket');
        page.evaluate(function(env){
            var units = document.getElementsByName("units")[0];
            units.value=1;
            units.setAttribute("data-selected-value",1);
            document.getElementsByClassName("order-button")[0].click();
        },env);
    },
    function(env){
        console.log('Step ' + env.stepIndex + ' login again '+env.username);
        page.evaluate(function(env){
            document.getElementById("u").value=env.username;
            document.getElementById("p").value=env.password;
            document.getElementById("login_button").click();
            document.getElementById("login").submit();
        },env);
    },
    function(env){
        console.log('Step ' + env.stepIndex + ' purchase');
        page.evaluate(function(env){
            document.getElementById("ml_clr").click();
            document.getElementById("purchase-button-bottom").click();
        },env);
    },
];

//Execute steps one by one
var stepByStep = function(stepIndex){
    var env = system.env;
    console.log(stepIndex);
    if(stepIndex < steps.length){
        env.stepIndex = stepIndex + 1;
        page.onLoadFinished = function(){stepByStep(stepIndex+1);};
        steps[stepIndex](env);
    }else{ 
        /*
    var fs = require('fs');
    var result = page.evaluate(function(env) {
    return document.querySelectorAll("html")[0].outerHTML;
    },env);
    fs.write('RakutenIchibaLoggedIn.html',result,'w');
    */
        phantom.exit();
    } 
};
page.onConsoleMessage = function(msg) {
    console.log(msg);
};
stepByStep(0);
