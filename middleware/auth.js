var Errors = require('../core/errors');

module.exports = {
    basic: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    },
    api: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        var error = Errors.AUTHORIZATION;

        res.status(error.status).send(error);
    }
}
