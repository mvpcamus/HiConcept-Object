"use strict";
var publish = require(__dirname+'/lib/publish.js');
var subscribe = require(__dirname+'/lib/subscribe.js');
var websocket = require(__dirname+'/lib/websocket.js');

var defaultConf = {
    protocol: "http",
    selfSignedCert: false,
    host: "localhost",
    port: 80,
    name: null,
    uuid: null,
    topic: null
};

function setConf(config) {
    if(!config) {
        config = defaultConf;
    }

    if(config.name && config.uuid) {
        config.auth = config.name+':'+config.uuid;
    } else if(config.auth !== undefined) {
        //nothing to do
    } else {
        config.auth = null;
    }
    if(config.topic) {
        config.path = '/topics/'+config.topic;
    } else if(config.path !== undefined) {
        //nothing to do
    } else {
        config.path = null;
    }
    delete config.name;
    delete config.uuid;
    delete config.topic;

    return config;
}

exports.pub = function(config, content, callback) {
    config = setConf(config);
    publish(config, content, callback);
}

exports.sub = function(config, callback) {
    config = setConf(config);
    subscribe(config, callback);
}

exports.ws = function(config, callback) {
    config = setConf(config);
    return websocket(config, callback);
}
