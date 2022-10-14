// By:       Jefe
// Contact:  https://app.roll20.net/users/451842/jefe
// requires ApiExtensions/statusMarkerHelpers.js
var ConditionMarkers = ConditionMarkers || (function() {
    'use strict';
    
    var version = 0.2,
        conditionToStatusList = [
            { condition: "red",             status: "red" },
            { condition: "blue",            status: "blue" },
            { condition: "green",           status: "green" },
            { condition: "brown",           status: "brown" },
            { condition: "purple",          status: "purple" },
            { condition: "pink",            status: "pink" },
            { condition: "yellow",          status: "yellow" },
            { condition: "dead",            status: "dead" },
            { condition: "blessed",         status: "aura" },
            { condition: "blinded",         status: "bleeding-eye" },
            { condition: "charmed",         status: "chained-heart" },
            { condition: "concentrating",   status: "stopwatch" },
            { condition: "deafened",        status: "interdiction" },
            { condition: "exhausted",       status: "half-heart" },
            { condition: "flying",          status: "angel-outfit" },
            { condition: "frightened",      status: "screaming" },
            { condition: "frozen",          status: "frozen-orb" },
            { condition: "grappled",        status: "grab" },
            { condition: "hasted",          status: "fluffy-wing" },
            { condition: "hiding",          status: "ninja-mask" },
            { condition: "incapacitated",   status: "arrowed" },
            { condition: "invisible",       status: "half-haze" },
            { condition: "paralyzed",       status: "padlock" },
            { condition: "petrified",       status: "white-tower" },
            { condition: "poisoned",        status: "skull" },
            { condition: "prone",           status: "back-pain" },
            { condition: "raging",          status: "strong" },
            { condition: "restrained",      status: "fishing-net" },
            { condition: "slowed",          status: "snail" },
            { condition: "stunned",         status: "pummeled" },
            { condition: "surrendered",     status: "black-flag" },
            { condition: "targeted",        status: "archery-target" },
            { condition: "unconscious",     status: "sleepy" },
            { condition: "weakened",        status: "broken-heart" },
            { condition: "webbed",          status: "cobweb" },
        ],

    findStatus = function(condition) {
        var found = _.find(conditionToStatusList, function(entry) { 
            return entry.condition == condition;
        });
        if (typeof(found) != "undefined") { 
            return found.status; 
        } else {
            sendChat("Condition Script Error", "no status found for condition '"+condition+"'");
            return;
        }
    },

    toggleCondition = function(selected, condition) {
        var status = findStatus(condition);
        if (status) {
            _.each(selected, function(token){
                toggleMarker(token, status); 
            });            
        }
    },

    setCondition = function(selected, condition) {
        var status = findStatus(condition);
        if (status) {
            var i = 0;
            var size = _.size(selected);
            _.each(selected, function(token){ 
                var num = "";
                i = i+1;
                if(size > 1) {
                    num = i.toString 
                }
                statusMarkerOn(token, status, num); 
            });            
        }
    },

    unsetCondition = function(selected, condition) {
        var status = findStatus(condition);
        if (status) {
            _.each(selected, function(token){ 
                statusMarkerOff(token, status); 
            });            
        }
    },

    clearConditions = function(selected) {
        _.each(selected, function(token){
            clearStatusMarkers(token);
        });
    },

    hasCondition = function(selected, condition) {
        var status = findStatus(condition);
        if (status) {
            return _.every(selected, function(token){
                return hasStatusMarker(token, status);
            });            
        }
    },

    processConditionMessage = function(msg, command, args) {
        var condition = args.shift(),
            num = args.shift();
        
        if (command == "!condition") { 
            toggleCondition(msg.selected, condition);
        } 
        else if (command == "!setCondition") {
            setCondition(msg.selected, condition, num);
        }
        else if (command == "!unsetCondition") {
            unsetCondition(msg.selected, condition);
        }
        else if (command == "!clearConditions") {
            clearConditions(msg.selected);
        }
        else if (command == "!hasCondition") {
            hasCondition(msg.selected, condition, num);
        }
        return;
    },

    handleInput = function(msg) {
        if ( "api" !== msg.type ) {
            return; 
        }

        var content = msg.content,
            args = content.split(/\s+/), 
            command = args.shift();

        switch(command) {
            case "!unsetCondition":
            case "!setCondition":
            case "!condition":
            case "!clearConditions":
            case "!hasCondition":
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
        registerEventHandlers: registerEventHandlers,
        toggleCondition: toggleCondition,
        hasCondition: hasCondition,
        setCondition: setCondition,
        unsetCondition: unsetCondition,
        clearConditions: clearConditions
    };
}());

on('ready', function() {
    'use strict';
    ConditionMarkers.checkInstall();
    ConditionMarkers.registerEventHandlers();
});
