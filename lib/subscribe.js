module.exports = function(config, query, callback) {
    var queryString = '?';
    try {
        if (query.time) { // set time query
            if (typeof query.time[0]=='number' && typeof query.time[1]=='number') {
                queryString += 'time=['+query.time[0]+','+query.time[1]+']&';
            } else if (typeof query.time[0]=='number') {
                queryString += 'time=['+query.time[0]+','+Date.now()+']&';
            } else if (typeof query.time[1]=='number') {
                querysString += 'time=[0,'+query.time[1]+']&';
            } else {
                throw false;
            };
        };
        if (query.data) { // set data query
            queryString += 'data='+JSON.stringify(query.data);
        };
        if (queryString.length < 2) throw false; // empty query
    } catch (error) {
        return console.error('ERROR: INVALID SUBSCRIBE QUERY');
    }
    try {
        var proto = require(config.protocol.toLowerCase());
        var options = {
            hostname: config.host,
            port: config.port,
            auth: config.auth,
            path: config.path+queryString,
            method: 'GET',
            rejectUnauthorized: !config.selfSignedCert
        };
        var req = proto.request(options, function(response) {
            var data = '';
            console.log('statusCode: ', response.statusCode);
            console.log('headers: ', response.headers);
            response.on('data', function(chunk) {
                data += chunk;
            });
            response.on('end', function() {
                callback(data); // process to handle data
            });
        });
        req.on('error', function(error) {
            console.error(error);
        });
        req.end();
    } catch (error) {
        return console.error('ERROR: INVALID SUBSCRIBE OPTIONS');
    }
}
