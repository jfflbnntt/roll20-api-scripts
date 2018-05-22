// By:       Jefe
// Contact:  https://app.roll20.net/users/451842/jefe
var ConcentrationModule = ConcentrationModule || (function() {
    'use strict';

    var version = 0.2,
        baseDC = 10,
        bar = "bar1",
        concentrationMarker = "stopwatch",
        conCheckTemplate = "&{template:default} {{name=Concentration Check}} {{target=!target}} {{note=!note}} {{DC=!saveDC}}",
        conLostTemplate = "&{template:default} {{name=Concentration Lost}} {{target=!target}} {{note=Target has lost Concentration!}}",
    
    checkInstall = function() {
        log('Concentration v'+version+' Ready');
	},
    
    handleMessages = function(msg) {
    },

    checkConcentration = function(obj, prev) {
        var hpMax = obj.get(bar+"_max");
        var hpCurr = obj.get(bar+"_value");
        var isConcentrating = obj.get("status_"+concentrationMarker);

        // ignore objects with no hp or not concentrating
        if(hpMax === "" || hpCurr === "" || !isConcentrating) return;

        // if unconscious...
        if(hpCurr <= 0) {
            // remove concentration marker
            obj.set('status_' + concentrationMarker, false);
            // remind GM concentration is lost
            var message =  conLostTemplate.replace("!target", obj.get("name"));
            sendChat("gm", message);            
        } else {
            var hpPrev = prev[bar+"_value"];
            var hpDiff = hpPrev - hpCurr;
            if(hpDiff > 0) {
                var damageDC = Math.round(hpDiff / 2);
                var concDC = Math.max(damageDC, baseDC);
                var message = conCheckTemplate.replace("!target", obj.get("name")).replace("!note", "Target must make a Concentration check!").replace("!saveDC", concDC);
                sendChat("gm", message);
            }
        }
     
    },

    registerEventHandlers = function() {
        on('chat:message',handleMessages);
        on('change:token',checkConcentration);
    };

    return {
		CheckInstall: checkInstall,
		RegisterEventHandlers: registerEventHandlers
	};
}());

on('ready', function() {
    'use strict';
    ConcentrationModule.CheckInstall();
    ConcentrationModule.RegisterEventHandlers();
});