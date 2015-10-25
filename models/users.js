var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uuid = require('node-uuid').v4;

var Users = mongoose.model('User', {
    _id: { type: String, index: true, default: uuid },
    displayName: String,
    created: Date,
    facebookId: { type: String, index: true },
    heroes : [{ type: String, ref: 'Heroes' }],
    wsToken: String
});

module.exports = Users;
