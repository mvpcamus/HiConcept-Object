#!/usr/bin/env node
"use strict";

global._homePath = __dirname;

var config = require(_homePath+'/config/config.json');
var publish = require(_homePath+'/lib/publish.js');
var subscribe = require(_homePath+'/lib/subscribe.js');

config.auth = config.name+':'+config.uuid;
delete config.name;
delete config.uuid;
config.path = '/topics/'+config.topic;
delete config.topic;
console.log(config);

publish(config, {"text":"Success"});
setTimeout(function() {
    subscribe(config);
}, 1000);
