module.exports = function(config, callback) {
    if (config.protocol.toLowerCase() == 'http' || config.protocol.toLowerCase() == 'https') {
        var proto = require(config.protocol.toLowerCase());
        var options = {
            hostname: config.host,
            port: config.port,
            auth: config.auth,
            path: config.path,
            method: 'GET',
            rejectUnauthorized: !config.selfSignedCert
        };
        var req = proto.request(options, function(response) {
            console.log('statusCode: ', response.statusCode);
            console.log('headers: ', response.headers);
            response.on('data', function(data) {
                callback(data); // process to handle data
            });
        });
        req.on('error', function(error) {
            console.error(error);
        });
        req.end();
    } else {
        console.error("ERROR: Wrong options");
    }
}
