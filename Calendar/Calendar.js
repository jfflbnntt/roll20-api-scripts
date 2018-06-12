// By:       Jefe
// Contact:  https://app.roll20.net/users/451842/jefe
var Calendar = Calendar || (function() {
    'use strict';
    
    var version = 0.4,
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
            "hour"  : "day",
            "day"   : "week",
            "week"  : "month",
            "month" : "year"
        },

    formattedDate = function(calendarId) {
        var year =  parseInt(getAttrByName(calendarId, "year")), 
            month =  parseInt(getAttrByName(calendarId, "month")) + 1, 
            week =  parseInt(getAttrByName(calendarId, "week")) + 1, 
            day = parseInt(getAttrByName(calendarId, "day")) + 1;

        return year+"/"+month+"/"+week+"/"+day;
    },

    showFormattedDate = function(calendarId) {
        sendChat("", "/desc The current date is "+formattedDate(calendarId));

    },

    timeOfDay = function(calendarId) {
        var hour = parseInt(getAttrByName(calendarId, "hour")),
            minute = parseInt(getAttrByName(calendarId, "minute")),
            second = parseInt(getAttrByName(calendarId, "second")),
            useMilitaryTime = getAttrByName(calendarId, "militaryTime") == "true",
            dayTime = "";

        if(!useMilitaryTime) {
            if(hour >= 12) {
                dayTime = " pm";
                if(hour >= 13) {
                    hour = hour - 12;
                }
            } else {
                dayTime = " am";
                if(hour == 0) {
                    hour = 12;
                }
            }
        }
        if(minute < 10) {
            minute = "0"+minute;
        }
        if(second < 10) {
            second = "0"+second;
        }
        return hour+":"+minute+":"+second+dayTime;
    },

    showTimeOfDay = function(calendarId) {
        sendChat("", "/desc The current time is "+timeOfDay(calendarId));
    },

    getCalendarId = function() {
        var calendar = findObjs({type: "character", name: "Calendar"})[0],
            calendarId = calendar.id;
        return calendarId;
    },

    getAttr = function(objId, attrName) {
        var attr = findObjs({type: "attribute", characterid: objId, name: attrName})[0];
        return attr;
    },

    showHelp = function() {
        var help = "/w gm calendar help!";
        sendChat("", help);
    },

    // set or add time (add negative to subtract)
    setTime = function(calendarId, unit, amount, addToCurrent) {
        var unitOverflow = overflowTable[unit],
            unitAttr = getAttr(calendarId, unit),
            current = parseInt(unitAttr.get("current")),
            max = parseInt(unitAttr.get("max")),
            result = 0, 
            overflowAmount = 0;

        // add or set check
        if(addToCurrent) {
            result = current + amount;
        } else {
            result = amount;
        }

        // determine overflow amount if any
        if(max > 0) {
            overflowAmount = Math.trunc(result / max);
            result = result % max;
            // handle negatives
            if(result < 0) {
                result +=  max;
                overflowAmount -= 1;
            }
            // handle overflow amount if applicable
            if (overflowAmount != 0 && unitOverflow != undefined) {
                setTime(calendarId, unitOverflow, overflowAmount, true);
            }
        }

        // finally set result
        unitAttr.set("current", result);
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
        } else if(arg1 == "time") {
            showTimeOfDay(calendarId); 
        } else if (arg1 = "date") {
            showFormattedDate(calendarId);             
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
