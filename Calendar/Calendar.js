// By:       Jefe
// Contact:  https://app.roll20.net/users/451842/jefe
var Calendar = Calendar || (function() {
    'use strict';
    
    var version = 0.1,
        unitTable = {
            's': "second",
            'm': "minute",
            'h': "hour",
            'd': "day",
            'w': "week",
            'M': "month",
            'y': "year"
        },
        overflowTable = {
            "second": "minute",
            "minute": "hour",
            "hour": "day",
            "day": "week",
            "week": "month",
            "month": "year"
        },

    getCalendarId = function() {
        var calendar = findObjs({type: "character", name: "Calendar"})[0],
            calandarId = calendar.id;
        return calandarId;
    },

    getAttr = function(objId, attrName) {
        var attr = findObjs({type: "attribute", characterid: objId, name: attrName})[0];
        return attr;
    },

    showHelp = function() {
        var help = "/gm calendar help!";
        sendChat("", help);
    },

    addTime = function(unitInput, amountInput) {
        var amount = parseInt(amountInput),
            unitName = unitTable[unitInput.charAt(0)],
            unitOverflow = overflowTable[unitName],
            calendarId = getCalendarId(),
            unitAttr = getAttr(calendarId, unitName),
            current = parseInt(unitAttr.get("current")),
            max = parseInt(unitAttr.get("max")),
            total = current + amount, 
            result = 0, 
            overflowAmount = 0;

        if(max > 0) {
            result = total % max;
            overflowAmount = Math.floor(total / max);
        } else {
            result = total;
        }

        unitAttr.set("current", result);

        if (overflowAmount > 0 && unitOverflow != undefined) {
            addTime(unitOverflow, overflowAmount);
        }
    },

    processCalendarCommand = function(msg, command, args) {
        var arg1 = args.shift();

        if(arg1.indexOf("+") == 0) {
            var unit = arg1.substring(1),
                amount = args.shift();
            addTime(unit, amount);
        } else {
            showHelp();
            return;
        }
    },

    handleInput = function(msg) {
        if ( "api" !== msg.type ) {
            return; 
        }

        var content = msg.content,
            args = content.split(/\s+/), 
            command = args.shift();

        switch(command) {
            case "!calendar":                
                processCalendarCommand(msg, command, args);
                return;
        }
    },
   
    checkInstall = function() {
        log('Calendar v'+version+' Ready');            
    },

    registerEventHandlers = function() {
        on('chat:message', handleInput);
    };
        
    return {
        checkInstall: checkInstall,
        registerEventHandlers: registerEventHandlers,
    };
}());

on('ready', function() {
    'use strict';
    Calendar.checkInstall();
    Calendar.registerEventHandlers();
});
