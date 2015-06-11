module.exports = function(config, contents) {
    if ((config.protocol.toLowerCase() == 'http' || config.protocol.toLowerCase() == 'https')
        && typeof contents == 'object' && Object.keys(contents).length != 0) {
console.log('============ publish ============='); //TODO remove
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
            rejectUnauthorized: false   //TODO remove or put into configuration
        };
        var req = proto.request(options, function(response) {
            console.log('statusCode: ', response.statusCode);
            console.log('headers: ', response.headers);
            response.setEncoding('utf8');
            response.on('data', function(data) {
//                process.stdout.write(data); //TODO process to handle ack
                console.log('data: ', data); //TODO remove
            });
        });
        req.on('error', function(error) {
            console.error(error);
        });
        req.write(postData);
        req.end();
    }
}
