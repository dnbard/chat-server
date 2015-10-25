var Users = require('../models/users');
var uuid = require('node-uuid').v4;

exports.default = function(req, res){
    if (!req.isAuthenticated()){
        return res.render('indexDefault.jade');
    }

    var websocketToken = uuid();

    Users.findById(req.user._id, function(err, user){
        user.wsToken = websocketToken;
        user.save(function(err){
            res.render('indexAuth.jade', {
                userId: req.user._id,
                websocketToken: websocketToken
            });
        });
    });
}
