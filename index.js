'use strict';
const phantomjsLambdaPack = require('phantomjs-lambda-pack');
const exec = phantomjsLambdaPack.exec;
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-1';

exports.handler = (event, context, callback) => {
    const scriptPath = path.join(__dirname, 'phantomjs-script.js');
    exec(scriptPath, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`Result: ${stdout}`);
        console.log(`Should have no error: ${stderr}`);
    })
}
