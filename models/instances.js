var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uuid = require('node-uuid').v4;
var WS = require('../core/websockets');

var schema =  new Schema({
    _id: { type: String, index: true, default: uuid }
});

schema.static('createBasic', function(){
    var instance = new Instance();
    instance.save();

    return instance;
});

var Instance = mongoose.model('Instance', schema);

module.exports = Instance;
