var config = require('../config');
var Config = require('../models/config');

module.exports = function(cb){
    Config.find({}).lean().exec().then(function(configEntries){
        configEntries.forEach(function(configEntry){
            config.set(configEntry.key, configEntry.value);
        });

        if (typeof cb === 'function') {
            cb(config);
        }
    });
}
