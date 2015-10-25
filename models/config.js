var mongoose = require('mongoose');

module.exports = mongoose.model('Config', {
    key: { type: String, index: true },
    value: String
});
