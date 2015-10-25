var isInitialized = false;

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../config');
var Users = require('../models/users');
var dispatcher = require('../core/dispatcher');
var Events = require('../enums/events');

exports.init = function(app){
    if (isInitialized){
        throw new Error('Application is already initialized');
    }

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new FacebookStrategy({
            clientID: config.get('facebookClientId'),
            clientSecret: config.get('facebookClientSecret'),
            callbackURL: config.get('facebookCallbackUrl')
        },
        function (accessToken, refreshToken, profile, done) {
            Users.findOne({ facebookId: profile.id }).exec()
                .then(function(user){
                    if (!user){
                        user = new Users({
                            facebookId: profile.id,
                            displayName: profile.displayName
                        });
                        user.save(function(err, user){
                            if (err){
                                return done(err);
                            }

                            dispatcher.emit(Events.USER.CREATED, user);

                            done(null, user);
                        });
                    } else {
                        done(null, user);
                    }
                });
        }
    ));

    passport.serializeUser(function (user, done) {
//        console.log('Serialize: %s', user._id);
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
//        console.log('Deserialize: %s', user._id);

        Users.findById(user._id, function(err, user){
            if(!err){
                done(null, user);
            } else {
                done(err, null)
            }
        });
    });

    isInitialized = true;
}
