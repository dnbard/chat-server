var express = require('express');
var app = express();
var mongoose = require('mongoose');
var fs = require('fs');
var WebSocketServer = require('ws').Server;
var WebSocketService = require('./core/websockets');

mongoose.connect('mongodb://localhost:27017/brackets-chat', require('./core/configParser')(function(config){
    console.log('Connected to database(type:mongodb)');

    var server = app.listen(process.env.PORT || config.get('port'), function () {
        require('./middleware').init(app);
        require('./routing').init(app);

        var wss = new WebSocketServer({server: server});
        WebSocketService.init(wss);
    });
}));
