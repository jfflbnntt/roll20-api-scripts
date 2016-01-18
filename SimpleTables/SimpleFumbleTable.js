// By:       Jefe
// Contact:  https://app.roll20.net/users/451842/jefe
var FumbleTable = FumbleTable || (function() {
    'use strict';

    var version = 0.1,
        rangeMax = 10,
        apiCommand = "!fumble",
        speakingAs = "Fumble Table",
        sendMsgTo = "/w GM ",
        msgFormat = sendMsgTo + "(!roll) - !result",
        table = [
            {range: [1,2,3], result: "Nothing Happens"},
            {range: [4,5], result: "Fall prone"},
            {range: [6,7], result: "Drop weapon"},
            {range: [8,9], result: "Hit ally"},
            {range: [10], result: "Death" }
        ],


    
    checkInstall = function() {
        log('FumbleTable v'+version+' Ready');
	},
    

    writeResult = function(rollResult) {
        sendChat(speakingAs, msgFormat.replace('!roll', rollResult.roll).replace('!result', rollResult.result));
    },

    rollOnTable = function() {
        var roll = randomInteger(rangeMax);
        var checkRange = function(entry){ return entry.range.indexOf(roll) !== -1 };
        var tableEntry = _.find(table, checkRange);
        return {
            roll: roll,
            result: tableEntry.result
        };
    },

    handleInput = function(msg) {
        var args;
        if(msg.type !== "api") {
            return;
        }
        args = msg.content.split(/\s+/);
        switch(args[0]) {
            case apiCommand:
                writeResult(rollOnTable());
        }
    },

    init = function() {
        checkInstall();
        on("chat:message", handleInput);
    };

    return {
		init: init
	};
}());

on('ready', function() {
    'use strict';
    FumbleTable.init();
});