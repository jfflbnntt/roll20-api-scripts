// By:       Jefe
// Contact:  https://app.roll20.net/users/451842/jefe
// requires ApiExtensions/statusMarkerHelpers.js
var MarkTarget = MarkTarget || (function() {
    'use strict';
    
    var version = 0.1,
        targetedStatus = "archery-target",

    markTarget = function(tokenId) {
        statusMarkerOn(tokenId, targetedStatus);
    },

    unmarkTarget = function(tokenId) {
        statusMarkerOff(tokenId, targetedStatus);
    },

    toggleTarget = function(tokenId) {
        toggleMarker(tokenId, targetedStatus);
    },

    isTarget = function(tokenId) {
        return hasStatusMarker(tokenId, targetedStatus);
    },

    processTargetMessage = function(msg, command, args) {
        var tokenId = args.shift();

        if(typeof(tokenId) == "undefined") {
            sendChat("MarkTarget Script Error", "no tokenId found");
            return;
        }

        if (command == "!markTarget") { 
            markTarget(tokenId);
        } 
        else if (command == "!unmarkTarget") {
            unmarkTarget(tokenId);
        }
        else if (command == "!toggleTarget") {
            toggleTarget(tokenId);
        }
        else if (command == "!isTarget") {
            isTarget(tokenId);
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
            case "!markTarget":
            case "!unmarkTarget":
            case "!toggleTarget":
                processTargetMessage(msg, command, args);
                return;
        }
    },
   
    checkInstall = function() {
        if (! STATUS_MARKER_HELPERS_VERSION) {
            log("Error: MarkTarget depends on statusMarkerHelpers");
        } else {
            log('MarkTarget v'+version+' Ready');            
        }
    },

    registerEventHandlers = function() {
        on('chat:message', handleInput);
    };
        
    return {
        checkInstall: checkInstall,
        registerEventHandlers: registerEventHandlers,
        isTarget: isTarget,
        markTarget: markTarget,
        unmarkTarget: unmarkTarget,
        toggleTarget: toggleTarget,
    };
}());

on('ready', function() {
    'use strict';
    MarkTarget.checkInstall();
    MarkTarget.registerEventHandlers();
});
