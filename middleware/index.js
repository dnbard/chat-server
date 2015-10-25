var isInitialized = false;

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var config = require('../config');
var morgan = require('morgan');

exports.init = function(app){
    if (isInitialized){
        throw new Error('Application is already initialized');
    }

    app.use(morgan('tiny'));
    app.use(express.static('public'));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(session({
        secret: config.get('sessionSecret'),
        cookie: { secure: false },
        resave: false,
        saveUninitialized: true
    }));


    isInitialized = true;

    console.log('Middlewares initialized');
}
