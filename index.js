"use strict";
var config = require(__dirname+'/config/config.json');
var publish = require(__dirname+'/lib/publish.js');
var subscribe = require(__dirname+'/lib/subscribe.js');

config.auth = config.name+':'+config.uuid;
delete config.name;
delete config.uuid;
config.path = '/topics/'+config.topic;
delete config.topic;

exports.sub = function(callback) {
    subscribe(config, callback);
}

exports.pub = function(content, callback) {
    publish(config, content, callback);
}
