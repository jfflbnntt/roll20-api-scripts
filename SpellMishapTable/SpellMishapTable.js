// By:       Jefe
// Contact:  https://app.roll20.net/users/451842/jefe
var SpellMishapTable = SpellMishapTable || (function() {
    'use strict';

    var version = 0.1,
        rangeMax = 8,
        apiCommand = "!spell-mishap",
        helpMsg = "Usage - "+apiCommand+" [--help|-h] [--private|-w]. '--help' will return this message. '--private' will return the result in a whisper.",
        tableName = "Spell Mishap Table",
        msgTemplate = "&{template:default} {{name=Spell Mishap}} {{roll=!roll}} {{effect=!effect}}",
        table = [
            {range: [1,2], effect: "The spell is lost, but no other effect."},
            {range: [3], effect: "The spell activates in [[1d12]] hours. If the caster was the intended target, the spell takes effect normally. If the caster was not the intended target, the spell goes off in the general direction of the intended target, up to the spell's maximum range, if the target has moved away."},
            {range: [4], effect: "The caster suffers a minor but bizarre effect related to the spell. Such effects last only as long as the original spell's duration. or [[2d10]] minutes for spells that take effect immediately. For example, a fireball might cause smoke to pour from the caster's ears for 10 minutes."},
            {range: [5], effect: "The spell's effect is contrary to its normal effect but is neither harmful nor beneficial. For example, a fireball might produce an area of harmless cold."},
            {range: [6], effect: "The spell takes effect at a random location within the spell's range."},
            {range: [7], effect: "The spell affects the caster or an ally instead of the intended target, or affects a random target nearby if the caster was the intended target."},
            {range: [8], effect: "A surge of uncontrolled magical energy deals [[1d6]] psychic damage per spell level to the caster"}
        ],
    
    checkInstall = function() {
        log(tableName+' v'+version+' Ready');
	},
    
    replaceTemplateValues = function(result) {
        return msgTemplate.replace('!roll', result.roll).replace('!effect', result.effect);
    },

    writeResult = function(msg, isPrivate, result) {
        var message, speakingAs;
        if(result.error) {
            message = result.message + "\n" + helpMsg;
            speakingAs = tableName;
        } else {
            speakingAs = msg.who || tableName;
            message = replaceTemplateValues(result);
        }
        if(isPrivate) {
            speakingAs = tableName;
            message = "/w "+msg.who+" "+message;
        }
        sendChat(speakingAs, message);
    },

    rollOnTable = function() {
        var roll = randomInteger(rangeMax);
        var checkRange = function(entry){ return entry.range.indexOf(roll) !== -1 };
        var tableEntry = _.find(table, checkRange);
        if(tableEntry === undefined) {
            return {
                error: true,
                message: "Error - no entry found for roll "+roll
            };
        } else {
            return {
                roll: roll,
                effect: tableEntry.effect,
            };            
        }
    },

    getResult = function(params) {
        return rollOnTable();
    },

    handleInput = function(msg) {
        var args;
        if(msg.type !== "api") {
            return;
        }
        args = msg.content.split(/\s+/);
        if(args[0] == apiCommand) {
            args.shift();
            if (args[0] == "--help" || args[0] == "-h")
                sendChat(tableName, helpMsg);
            else {
                var isPrivate = false;
                if(args[0] == "--private" || args[0] == "-w") {
                    isPrivate = true;
                    args.shift();
                }
                writeResult(msg, isPrivate, getResult(args));
            }
        }
    },

    registerEventHandlers = function() {
        on("chat:message", handleInput);
    };

    return {
        CheckInstall: checkInstall,
		RegisterEventHandlers: registerEventHandlers
	};
}());

on('ready', function() {
    'use strict';
     SpellMishapTable.CheckInstall();
     SpellMishapTable.RegisterEventHandlers();
});