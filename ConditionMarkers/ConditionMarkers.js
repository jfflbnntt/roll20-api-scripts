// By:       Jefe
// Contact:  https://app.roll20.net/users/451842/jefe
// requires ApiExtensions/statusMarkerHelpers.js
var ConditionMarkers = ConditionMarkers || (function() {
    'use strict';
    
    var version = 0.1,
        conditionToStatusList = [
            { condition: "blinded",         status: "bleeding-eye" },
            { condition: "charmed",         status: "chained-heart" },
            { condition: "deafened",        status: "interdiction" },
            { condition: "exhausted",       status: "half-heart" },
            { condition: "frightened",      status: "screaming" },
            { condition: "grappled",        status: "grab" },
            { condition: "incapacitated",   status: "arrowed" },
            { condition: "invisible",       status: "half-haze" },
            { condition: "paralyzed",       status: "padlock" },
            { condition: "petrified",       status: "white-tower" },
            { condition: "poisoned",        status: "skull" },
            { condition: "prone",           status: "back-pain" },
            { condition: "restrained",      status: "fishing-net" },
            { condition: "stunned",         status: "pummeled" },
            { condition: "unconscious",     status: "sleepy" },
            { condition: "stealth",         status: "ninja-mask" },
            { condition: "slow",            status: "snail" },
            { condition: "concentration",   status: "stopwatch" },
            { condition: "rage",            status: "strong" },
            { condition: "hasted",          status: "fluffy-wing" },
            { condition: "blessed",         status: "aura" },
            { condition: "surrender",       status: "black-flag" },
            { condition: "weakened",        status: "broken-heart" },
            { condition: "webbed",          status: "cobweb" },
            { condition: "frozen",          status: "frozen-orb" },
            { condition: "flying",          status: "angel-outfit" },
        ],

    findStatus = function(condition) {
        var found = _.find(conditionToStatusList, function(entry) { return entry.condition == condition;});
        if (typeof(found) != "undefined") { return found.status; }
        return "";
    },

    processConditionMessage = function(msg, command, args) {
        var condition = args.shift(),
            status = findStatus(condition), 
            num = args.shift();

        if (command == "!condition") { 
            _.each(msg.selected, function(token){ 
                toggleMarker(token, status); 
            });
        } 
        else if (command == "!setCondition") {
            _.each(msg.selected, function(token){ 
                statusMarkerOn(token, status, num); 
            });
        }
        else if (command == "!unsetCondition") {
            _.each(msg.selected, function(token){ 
                statusMarkerOff(token, status); 
            });
        }
        else if (command == "!clearConditions") {
            _.each(msg.select, function(token){
                clearStatusMarkers(token);
            });
        }

    }

    handleInput = function(msg) {
        if ( "api" !== msg.type ) {return; }

        var args, command, 
            content = msg.content;

        args = content.split(/\s+/);
        command = args.shift();

        switch(command) {
            case "!unsetCondition":
            case "!setCondition":
            case "!condition":
            case "!clearConditions"
                processConditionMessage(msg, command, args);
                return; 
        }
    },
   
    checkInstall = function() {
        if (! STATUS_MARKER_HELPERS_VERSION) {
            log("Error: ConditionMarkers depends on statusMarkerHelpers");
        } else {
            log('ConditionMarkers v'+version+' Ready');            
        }
    },

    registerEventHandlers = function() {
        on('chat:message', handleInput);
    };
        
    return {
        checkInstall: checkInstall,
        registerEventHandlers: registerEventHandlers
    };
}());

on('ready', function() {
    'use strict';
    ConditionMarkers.checkInstall();
    ConditionMarkers.registerEventHandlers();
});