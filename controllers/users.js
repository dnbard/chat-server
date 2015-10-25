var Users = require('../models/users');
var Errors = require('../core/errors');

exports.getOneById = function(req, res, next){
    var id = req.params.uid;

    Users.findOne({ _id: id })
        .select({ facebookId: false })
        .exec(function(err, user){
            if (err){
                return next()
            }

            if (!user){
                return next(Errors.NOT_FOUND);
            }

            res.send(user);
        });
}
