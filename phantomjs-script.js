var webPage         = require('webpage');
var system          = require('system');
var CryptoJS        = require("crypto-js");
var page            = webPage.create();
var plain_password  = CryptoJS.AES.decrypt(system.env.password,system.env.password_key).toString(CryptoJS.enc.Utf8);

/*********CONFIGURATION***********/
page.settings.userAgent = 'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19';
page.settings.javascriptEnabled = true;
page.settings.loadImages        = false;//Script is much faster with this field set to false
phantom.cookiesEnabled          = true;
phantom.javascriptEnabled       = true;
var RAKUTEN_ICHIBA_TOP          = "http://www.rakuten.co.jp/";
/*********CONFIGURATION***********/

var steps = [
    function(env){
        console.log('Step ' + env.stepIndex + ': open Rakuten Ichiba top page ' + RAKUTEN_ICHIBA_TOP);
        page.open(RAKUTEN_ICHIBA_TOP, function(status){console.log(status);},env);
    },
    function(env){
        console.log('Step ' + env.stepIndex + ': click on the login button');
        page.evaluate(function(env){
            document.getElementById("loginBtn").firstChild.click();
        },env);
    },
    function(env){
        console.log('Step ' + env.stepIndex + ': submit the login form w/'+ env.username);
        page.evaluate(function(env){
            document.getElementById("username").value = env.username;
            document.getElementById("password").value = env.password;
            document.getElementsByName("submit")[0].click();
        },env);
    },
    function(env){
        console.log('Step ' + env.stepIndex + ': go to product page ' + env.product_url);
        page.open(env.product_url, function(status){console.log(status);},env);
    },
    function(env){
        console.log('Step ' + env.stepIndex + ': click on the purchase button');
        page.evaluate(function(env){
            document.getElementById("pdt_overview").firstChild.click();
        },env);
    },
    function(env){
        console.log('Step ' + env.stepIndex + ': go to the next step in the basket');
        page.evaluate(function(env){
            var units = document.getElementsByName("units")[0];
            units.value = 1; //set units 1 (just in case)
            units.setAttribute("data-selected-value",1);
            document.getElementsByClassName("order-button")[0].click();
        },env);
    },
    function(env){
        console.log('Step ' + env.stepIndex + ': login again w/'+ env.username);
        page.evaluate(function(env){
            document.getElementById("u").value = env.username;
            document.getElementById("p").value = env.password;
            document.getElementById("login_button").click();
            document.getElementById("login").submit();
        },env);
    },
    function(env){
        console.log('Step ' + env.stepIndex + ': purchase');
        page.evaluate(function(env){
            document.getElementById("ml_clr").click(); // deselect all checkboxes
            //document.getElementById("purchase-button-bottom").click();
        },env);
        page.open(RAKUTEN_ICHIBA_TOP, function(status){console.log(status);},env);
    },
];

page.onConsoleMessage = function(msg) {
    console.log(msg);
};

//Execute steps one by one
var stepByStep = function(stepIndex){
    var env = system.env;
    env.password = plain_password;
    if(stepIndex < steps.length){
        env.stepIndex = stepIndex + 1;
        page.onLoadFinished = function(){stepByStep(stepIndex + 1);};
        steps[stepIndex](env);
        return;
    }
    phantom.exit();
};
stepByStep(0);
