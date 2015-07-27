"use strict";
var config = require(__dirname+'/config/config.json');
var publish = require(__dirname+'/lib/publish.js');
var subscribe = require(__dirname+'/lib/subscribe.js');

config.auth = config.name+':'+config.uuid;
delete config.name;
delete config.uuid;
config.path = '/topics/'+config.topic;
delete config.topic;

exports.sub = function() {
    subscribe(config);
}

exports.pub = function(content) {
    publish(config, content);
}
