// By:       Jefe
// Contact:  https://app.roll20.net/users/451842/jefe
var Calendar = Calendar || (function() {
    'use strict';
    
    var version = 0.0,

    getCalendarProps = function() {
        var calendar = findObjs({_type: "character", name: "Calendar"})[0];
        props = findObjs({_type: "attribute", _characterid: calendar._id});
        return props;
    },

    showHelp = function() {
        var help = "/gm calendar help!";
        sendChat("", help);
    },

    addTime = function(amount, unit) {
        var unitProps = getCalendarProps();
        var unitName, unitAttr, unitCurrent, unitMax, unitTotal, unitOverflow;
        if(unit == "s" || unit == "sec" || unit == "second" || unit == "seconds") {
            unitName = "second";
            unitOverflow = "hour";
        }
        if(unit == "h" || unit == "hour" || unit == "hours") {
            unitName = "hour";
            unitOverflow = "day";
        }
        if(unit == "d" || unit == "day" || unit == "days") {
            unitName = "day";
            unitOverflow = "week";
        }
        if(unit == "w" || unit == "week" || unit == "weeks") {
            unitName = "week";
            unitOverflow = "month";
        }
        if(unit == "m" || unit == "month" || unit == "months") {
            unitName = "month";
            unitOverflow = "year";
        }
        if(unit == "y" || unit == "year" || unit == "years") {
            unitName = "year";
        }

        unitAttr = _.find(unitProps, function(p) { return p.name == unitName; });
        unitCurrent = unitAttr.get("current");
        unitMax = unitAttr.get("max");
        unitTotal = unitCurrent + amount;
        unitAttr.set("current", unitTotal);
    },

    processCalendarCommand = function(msg, command, args) {
        var arg1 = args.shift();
        if(arg1 == undefined || arg1 == help) {
            showHelp();
            return;
        }

        if(arg1 == "add" || "+") {
            var amount = args.shift(),
                timeType = args.shift();
            addTime(amount, unit);
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
