var EventEmitter = require('events').EventEmitter,
    dispatcher = new EventEmitter();

console.log('Dispatcher initialized');

dispatcher.setMaxListeners(0);

module.exports = dispatcher;
