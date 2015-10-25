var queryString = require('query-string');
var Users = require('../models/users');

var Clients = new Map();
var Subscriptions = new Map();

exports.init = function(wss){
    var Instance = require('../models/instances');

    var instance = Instance.createBasic().toObject();

    wss.on('connection', function(ws){
        var parsed;

        try{
            parsed = queryString.parse(ws.upgradeReq.url.replace(/[\/|?]/g, ''));
        } catch(e){
            return ws.close();
        }

        Users.findById(parsed.uid, function(err, user){
            if (!user || user.wsToken !== parsed.token || Clients.has(parsed.uid)){
                ws.close();
                console.log('Websocket client auto-disconnected');
            } else {
                console.log('Websocket client connected');

                Clients.set(parsed.uid, ws);
                subscribe(user, instance);

                ws.on('close', function(){
                    console.log('Websocket client disconnected');
                    Clients.delete(parsed.uid);
                });
            }
        });
    });
}

function subscribe(client, channel){
    if (Subscriptions.has(channel._id)){
        var subscriptions = Subscriptions.get(channel._id);
        if (subscriptions.indexOf(client._id) === -1){
            subscriptions.push(client._id);
        }
    } else {
        Subscriptions.set(channel._id, [ client._id ]);
    }

    sendMessage(channel, {
        userId: client._id,
        type: 'subscribed',
        instanceId: channel._id
    }, client._id);
}

function sendMessage(channel, message, id){
    var clients = Subscriptions.get(channel._id);
    var messageToSend = typeof message === 'string' ? message : JSON.stringify(message);

    if (clients === undefined){
        return;
    }

    clients.forEach(function(clientId){
        if (typeof id === 'string' && clientId !== id){
            return true;
        }

        var ws = Clients.get(clientId);

        if (!ws){
            console.log('No WebSocket connection are available for %s', clientId);
            return true;
        }

        ws.send(messageToSend);
    });
}

exports.sendMessage = sendMessage;
