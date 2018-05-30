// By:       Jefe
// Contact:  https://app.roll20.net/users/451842/jefe
var Calendar = Calendar || (function() {
    'use strict';
    
    var version = 0.2,
        unitTable = {
            's': "second",
            'm': "minute",
            'h': "hour",
            'D': "day",
            'W': "week",
            'M': "month",
            'Y': "year"
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
        var help = "/w gm calendar help!";
        sendChat("", help);
    },

    setTime = function(calendarId, unit, amount, addToCurrent) {
        var unitOverflow = overflowTable[unit],
            unitAttr = getAttr(calendarId, unit),
            current = parseInt(unitAttr.get("current")),
            max = parseInt(unitAttr.get("max")),
            total = 0, 
            result = 0, 
            overflowAmount = 0;

        if(addToCurrent) {
            total = current + amount;
        } else {
            total = amount;
        }

        if(max > 0) {
            result = total % max;
            overflowAmount = Math.trunc(total / max);
            // handle negatives
            if(result < 0) {
                result +=  max;
                overflowAmount -= 1;
            }
        } else {
            result = total;
        }

        unitAttr.set("current", result);

        if (overflowAmount != 0 && unitOverflow != undefined) {
            setTime(calendarId, unitOverflow, overflowAmount, true);
        }
    },

    processCalendarCommand = function(msg, command, args) {
        var arg1 = args.shift(),
            arg2 = args.shift(),
            calendarId = getCalendarId();

        if(arg1 != undefined && arg1.length > 1 && arg1.indexOf("+") == 0) {
            var unit = unitTable[arg1.charAt(1)],
                amount = parseInt(arg2);
            setTime(calendarId, unit, amount, true);
        } else if (arg1 != undefined && arg1.length > 1 && arg1.indexOf("-") == 0) {
            var unit = unitTable[arg1.charAt(1)],
                amount = -parseInt(arg2);
            setTime(calendarId, unit, amount, true);    
        } else if (arg1 != undefined && arg1.length > 1 && arg1.indexOf("=") == 0) {
            var unit = unitTable[arg1.charAt(1)],
                amount = parseInt(arg2);
            setTime(calendarId, unit, amount, false);                
        } else {
            showHelp();
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
        registerEventHandlers: registerEventHandlers
    };
}());

on('ready', function() {
    'use strict';
    Calendar.checkInstall();
    Calendar.registerEventHandlers();
});
