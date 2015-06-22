module.exports = function(config) {
    if (config.protocol.toLowerCase() == 'http' || config.protocol.toLowerCase() == 'https') {
        var proto = require(config.protocol.toLowerCase());
        var options = {
            hostname: config.host,
            port: config.port,
            auth: config.auth,
            path: config.path,
            method: 'GET',
            rejectUnauthorized: false   //TODO remove or put into configuration
        };
        var req = proto.request(options, function(response) {
            console.log('statusCode: ', response.statusCode);
            console.log('headers: ', response.headers);
            response.on('data', function(data) {
//                process.stdout.write(data); //TODO process to handle data
                console.log('data: ', data.toString('utf8')); //TODO remove
            });
        });
        req.on('error', function(error) {
            console.error(error);
        });
        req.end();
    }
}
