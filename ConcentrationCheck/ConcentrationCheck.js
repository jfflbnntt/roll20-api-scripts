// By:       Jefe
// Contact:  https://app.roll20.net/users/451842/jefe
var ConcentrationModule = ConcentrationModule || (function() {
    'use strict';

    var version = 0.1,
        baseDC = 10,
        bar = "bar1",
        concentrationMarker = "stopwatch",
    
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
            var message =  obj.get("name") +" has lost concentration!";
            sendChat("gm", message);            
        } else {
            var hpPrev = prev[bar+"_value"];
            var hpDiff = hpPrev - hpCurr;
            if(hpDiff > 0) {
                var damageDC = Math.round(hpDiff / 2);
                var concDC = damageDC;
                if(damageDC < baseDC) {
                    concDC = baseDC;
                }
                var message =  obj.get("name") +" needs to make a concentration check! CON save vs "+ concDC +".";
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