module.exports = function (config, callbackFunc)
{
    var ws;
    var WebSocket = require('ws');
    var module = {callback:callbackFunc};
    var connected = false;
    var connecting = false;
    var connStr;
    var conncallBack;

    var MsgForm = function (msgid, dest, data, type)
    {
        this.msgid = msgid; // Milleseconds
        this.dest = dest;   // Destination
        this.data = data;   // Orginal Message
        this.type = type;   // Reference RECV_MSG_TYPE
    }

    module.RECV_MSG_TYPE = {OPEN:'OPEN', RECV:'RECV', ERROR:'ERROR'};
    module.connect = function (connStr)
    {
       module.connectWithCallback(connStr);
    }

    module.connectWithCallback = function (connStr, connCallback)
    {
        if (connecting)
            return;
        else
            connecting = true;

        if (!connected)
        {
            if (connStr == null || connStr == undefined) {
                if (config.protocol == 'https') {
                    connStr = 'wss://'+config.auth+'@'+config.host+':'+config.port;
                } else {
                    connStr = 'ws://'+config.auth+'@'+config.host+':'+config.port;
                }
            }
            module.connStr = connStr;
            module.connCallback = connCallback;

            ws = new WebSocket(connStr,null,{rejectUnauthorized: !config.selfsigned});

            ws.on('error', errorFunc);
            ws.on('open', openFunc);
            ws.on('message', recvMsgFunc);
        }
        else
        {
            if (module.connCallback != null)
                setTimeout(module.connCallback(),10);
        }
    }

    module.close = function ()
    {
        ws.close();
        connected = false;
    }

    module.send = function (dest, orgMsg)
    {
        var sendData;

        if (connected)
        {
            sendData = new MsgForm(new Date().getTime(), dest, orgMsg, module.RECV_MSG_TYPE.RECV);
            //  console.log('Sending data : ' + JSON.stringify(sendData));
            ws.send(JSON.stringify(sendData));
        }
        else
        {
            sendData = new MsgForm(-1, dest, 'not opned', module.RECV_MSG_TYPE.ERROR);
            setTimeout(module.callback(sendData, 10));
        }

        return sendData.msgid;
    }

    function recvMsgFunc(inMsg)
    {
        var data = JSON.parse(inMsg);
        //data.type = module.RECV_MSG_TYPE.RECV;
        module.callback(data);
    }

    function openFunc()
    {
        // console.log('opned');
        connecting = false;
        connected = true;

        if (module.connCallback != null)
        {
            setTimeout(module.connCallback(),10);
        }
        else
        {
            console.log('conncallback is null');
        }

        var sendData = new MsgForm(0, null, 'Opend', module.RECV_MSG_TYPE.OPEN);
        module.callback(sendData);
    }

    function errorFunc(error)
    {
        var sendData = new MsgForm(-1, null, error + ' / Connection String : ' + module.connStr, module.RECV_MSG_TYPE.ERROR);
        module.callback(sendData);
    }

    return module;
};
