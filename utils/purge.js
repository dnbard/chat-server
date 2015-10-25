var collections = [{
    value: require('../models/users'),
    name: 'users'
},{
    value: require('../models/heroes'),
    name: 'heroes'
}];

var mongoose = require('mongoose');
var counter = 0;

mongoose.connect('mongodb://localhost:27017/artail', function(){
    collections.forEach(function(collection){
        collection.value.remove({}, function(err, data){
            console.log('Removed %s %s', data.result.n, collection.name);

            counter ++;
            if (counter === collections.length){
                mongoose.disconnect();
            }
        });
    });
});
