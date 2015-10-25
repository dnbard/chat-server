var SortedList = require('sortedlist');

var list = SortedList.create({
    compare: function(left, right){
        return left.timestamp > right.timestamp ? 1 :
            left.timestamp == right.timestamp ? 0 : -1;
    }
});

var setTimeoutToken = null;

function executeFirstActionHandler(){
    return function(){
        var action = list[0];

        list.remove(0);
        doSetTimeout();

        //console.log('Action executed. Actions to execute: %s', list.length);
        action.execute();
    }
}

function doSetTimeout(){
    if (list.length === 0){
        return;
    }

    var now = new Date(),
        timeout = list[0].timestamp - now;

    if (timeout < 0){
        timeout = 0;
    }

    if (setTimeoutToken){
        clearTimeout(setTimeoutToken);
    }

    setTimeoutToken = setTimeout(executeFirstActionHandler(), timeout);
}

exports.add = function(action){
    list.insertOne(action);
    doSetTimeout();

    //console.log('Actions added. Actions to execute: %s', list.length);
}

exports.createLoopAction = function(options){
    var timestamp = new Date();
    timestamp.setSeconds(timestamp.getSeconds() + 1);

    exports.add({
        timestamp: timestamp,
        execute: function(){
            options.execute(options.context);
            exports.createLoopAction(options);
        }
    });
}
