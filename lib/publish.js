module.exports = function(config, contents, callback) {
    if ((config.protocol.toLowerCase() == 'http' || config.protocol.toLowerCase() == 'https')
        && typeof contents == 'object' && Object.keys(contents).length != 0) {
        var proto = require(config.protocol.toLowerCase());
        var postData = JSON.stringify({
            'time': Date.now(),
            'data': contents
        });
        var options = {
            hostname: config.host,
            port: config.port,
            auth: config.auth,
            path: config.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            },
            rejectUnauthorized: !config.selfSignedCert
        };
        var req = proto.request(options, function(response) {
            if(config.verbose) {
                console.log('statusCode: ', response.statusCode);
                console.log('headers: ', response.headers);
            };
            response.setEncoding('utf8');
            response.on('data', function(data) {
                callback(data); // process to handle ack
            });
        });
        req.on('error', function(error) {
            console.error(error);
        });
        req.write(postData);
        req.end();
    } else {
        console.error("ERROR: INVALID PUBLISH OPTIONS or CONTENTS");
    }
}
