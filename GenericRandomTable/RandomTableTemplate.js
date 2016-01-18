'use strict';

// By:       Jefe
// Contact:  https://app.roll20.net/users/451842/jefe
var FumbleTable = FumbleTable || (function() {

    var version = 0.1,
        rangeMax = 10,
        table = [
            {range: "'1','2','3'", result: "Nothing Happens"},
            {range: "'4','5'", result: "Fall prone"},
            {range: "'6','7'", result: "Drop weapon"},
            {range: "'8','9'", retuls: "Hit ally"},
            {range: "'10'", results: "Death" }
        ],


    
    checkInstall = function() {
        log('FumbleTable v'+version+' Ready');
	},
    
    handleMessages = function(msg) {
        var result = rollOnTable();
    },

    rollOnTable = function() {
        var roll = randomInteger(rangeMax);
        var parsedRoll = "'"+roll+"'";
        var checkRange = function(entry){ entry.range.indexOf(parsedRoll) !== -1 };
        var tableEntry = _.find(table, checkRange);
        return {
            roll: roll,
            tableEntry: tableEntry
        };
    },

    registerEventHandlers = function() {
        if ((typeof(Shell) != "undefined") && (Shell) && (Shell.registerCommand)){
            Shell.registerCommand("!fumble", "!fumble <subcommand> [args]", "Roll on fumble table", handleMessages);
        }
        else{
            on("chat:message", handleMessages);
        }
    };

    return {
		checkInstall: checkInstall,
		registerEventHandlers: registerEventHandlers
	};
}());

on('ready', function() {
    FumbleTable.checkInstall();
    FumbleTable.registerEventHandlers();
});