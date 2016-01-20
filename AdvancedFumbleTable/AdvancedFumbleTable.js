// By:       Jefe
// Contact:  https://app.roll20.net/users/451842/jefe
var AdvancedFumbleTable = AdvancedFumbleTable || (function() {
    'use strict';

    var version = 0.1,
        rangeMax = 86,
        apiCommand = "!adv-fumble",
        helpMsg = "Usage - !adv-fumble [--help] [--private] [name]. Using [name] will search for and return a specific entry by name if found. '--help' will return this message. '--private' will return the result in a whisper.",
        tableName = "Advanced Fumble Table",
        msgTemplate = "&{template:default} {{name=!name}} {{roll=!roll}} {{effect=!effect}} !save",
        table = [
            {range: [1,2,3],    name: "Humorous Result",        effect: "You fail spectacularly in some humorous way, but otherwise suffer no additional penalty."},
            {range: [4,5,6],    name: "Embarrassing Result",    effect: "You embarrass yourself in front of everyone. Your next attack or skill check is made at Disadvantage."},
            {range: [7,8,9],    name: "Aiding the Enemy",       effect: "You accidentally Help your target with your attack, granting Advantage to its next Action."},
            {range: [10,11,12], name: "Off-Balance",            effect: "Your terrible attack has left you off-balance. Your next attack is at Disadvantage and the next attack against you has Advantage."},
            {range: [13,14,15], name: "Slip",                   effect: "You slip on something, probably some blood or gore. Save or your speed becomes 0 until the beginning of your next turn.", save: "DC 10 DEX"},
            {range: [16,17,18], name: "Dropped",                effect: "Whoops! Save or you drop whatever item was used in the attack, including weapons, focuses, ammunition, or spell components. Any item dropped scatters in a random direction and can't be used again until gathered.", save: "DC 10 DEX"},
            {range: [19,20,21], name: "Damaged",                effect: "An item used in the attack is damaged in some way. Attacks with the item suffer Disadvantage until it can be temporarily fixed by using an Action. If the item is unusually resilient then the item is 'Dropped' instead. If the item was already Damaged it is 'Broken' instead."},
            {range: [22,23,24], name: "Wardrobe Malfunction",   effect: "You get tangled up in your own armor, gear, or something in the environment. Save or become Restrained until someone spends an Action to fix it.", save: "DC 10 STR"},
            {range: [25,26,27], name: "Twisted Ankle",          effect: "Watch your step next time. Save or your speed is reduced by 5' for 10 minutes.", save: "DC 10 CON"},
            {range: [28,29,30], name: "I Think I Swallowed It", effect: "Some blood, guts, bugs, or something equally disgusting gets in your mouth. Save or become Poisoned until the end of your next turn.", save: "DC 10 CON"},
            {range: [31,32,33], name: "Noisy",                  effect: "Your attack causes a loud noise which can be heard from afar, possibly alerting more enemies."},
            {range: [34,35,36], name: "Huh?",                   effect: "You get distracted by something. You lose your Reaction until the start of your next turn."},
            {range: [37,38,39], name: "Panic Attack",           effect: "You temporarily panic. Save or become Frightened by your target until it is slain or incapacitated or until the end of your next turn, whichever comes first.", save: "DC 10 WIS"},
            {range: [40,41,42], name: "Bell Ringer",            effect: "Something hits you in the head. Save or become Incapacitated until the end of your next turn. Also make a DC 10 Concentration check or lose Concentration.", save: "DC 10 INT"},
            {range: [43,44,45], name: "Disheartened",           effect: "Your failure causes you to lose confidence. Save or all attacks and skill checks are at Disadvantage until the end of your next turn.", save: "DC 10 CHA"},
            
            {range: [46,47],    name: "It's Stuck!",            effect: "Your weapon or other item gets lodged in the target or environment. Save to free it, otherwise the item is unusable until someone spends an Action working it free. If no item was used or it is otherewise unlikely to get stuck, use 'Wardrobe Malfunction' instead.", save: "DC 15 STR"},
            {range: [48,49],    name: "Unguarded",              effect: "You let your guard down and provoke an opportunity attack from each adjacent enemy that can still take Reactions. If no attacks are provoked then the next attack against you is made with Advantage."},
            {range: [50,51],    name: "Off-Target",             effect: "You hit the next closest creature to the original target other than yourself within reach/range of and line of sight doing the minimum damage for the attack if any, but they suffer no other ill effects from the attack."},
            {range: [52,53],    name: "Self-Inflicted Wound",   effect: "You manage to hurt yourself somehow, taking the minimum amount of damage for the attack if any, but suffer no other ill effects from the attack."},
            {range: [54,55],    name: "Trip",                   effect: "You trip on something or someone on the ground. Save or fall Prone. If you are hovering, swimming, amorphous or otherwise cannot fall Prone then 'Stumble' instead.", save: "DC 15 DEX"},
            {range: [56,57],    name: "Stumble",                effect: "You stumble a few feet in a random direction. Stumbling can provoke attacks or expose you to other hazards. Stumbling does not require you to have movement available. Blocking, difficult, and occupied terrain reduce or stop movement as normal. Allies can use a Reaction to halt movement if Stumbling through an adjacent space."},
            {range: [58,59],    name: "Butter Fingers",         effect: "Items just slip through your grip for some reason. Save or you drop everything you are holding. Any item dropped scatters.", save: "DC 15 DEX"},
            {range: [60,61],    name: "Broken",                 effect: "An item used in the attack is broken and rendered unusable until it can be properly repaired, usually during a Short or Long Rest. If the item is unable to be broken or damaged in any way then it is 'Dropped' instead."},
            {range: [62,63],    name: "Hyperextended Knee",     effect: "I don't think it's supposed to bend that way. Save or your speed is reduced by 10' for 10 minutes.", save: "DC 15 CON"},
            {range: [64,65],    name: "What's that Smell?",     effect: "A nauseating odor assails your senses. Save or you are Poisoned until the end of your next turn.", save: "DC 15 CON"},
            {range: [66,67],    name: "Right in the Eyes",      effect: "Sweat, blood, dirt, or something else gets in your eyes or impairs your vision. You are Blinded until it is cleared away with an Action."},
            {range: [68,69],    name: "Freeze Up",              effect: "You freeze up for some reason. You're Incapacitated until the beginning of your next turn."},
            {range: [70,71],    name: "Irrational Fear",        effect: "For some reason the target suddenly scares the shit out of you. Save or become Frightened by your target until it is slain or incapacitated.", save: "DC 15 WIS"},
            {range: [72,73],    name: "Skull Crack",            effect: "You sustain a minor concussion. Save or become Stunned until the end of your next turn. In any case immediately lose Concentration if any, and all Concentration checks are made with Disadvantage for 10 minutes.", save: "DC 15 INT"},
            {range: [74,75],    name: "Despair",                effect: "Your total and constant failure causes you to spiral into despair. Save or all attacks and skill checks are made with Disadvantage for 10 minutes.", save: "DC 15 CHA"},

            {range: [76],       name: "Wrist Sprain",           effect: "The force of the blow or discharge of an attack sprains your wrist. Gain Disadvantage on attacks, skill, and ability checks with that hand for 10 minutes. Makes casting with Somatic components impossible."},
            {range: [77],       name: "Ear-Splitting",          effect: "Your attack causes a loud noise which hurts your ears and alerts others to your presence. Become Deafened until the end of your next turn. Makes casting spells with Verbal components impossible."},            
            {range: [78],       name: "Wide Open",              effect: "You are 'Unguarded' and any opportunity attacks provoked are made with Advantage."},
            {range: [79],       name: "Self-Destruction",       effect: "You target yourself with the attack and hit, taking the normal amount of damage if any and suffer any additional effects of the attack."},
            {range: [80],       name: "Friendly Fire",          effect: "You hit the next closest ally to the original target other than yourself within reach/range of and line of sight. They take the normal amount of damage if any and suffer any additional effects of the attack."},
            {range: [81],       name: "Fall",                   effect: "You fall Prone with no saving throw and your speed becomes 0' until the beginning of your next turn."},
            {range: [82],       name: "Destroyed",              effect: "An item used in the attack is utterly destroyed. If the item is unable to be destroyed or damaged in any way then it is 'Dropped' instead."},
            {range: [83],       name: "Pulled Groin",           effect: "Your speed is reduced to half until you take a Short or Long Rest. Additionally, you cannot stand from Prone without help."},
            {range: [84],       name: "Unlucky",                effect: "You're particularly unlicky today. Roll twice on this table."},
            {range: [85],       name: "Disastrous Result",      effect: "You fail spectacularly and cause some unintended disastrous effect of the DM's imagining. Environmental damage is strongely encouraged."},            
            {range: [86],       name: "DM's Choice",            effect: "DM picks from this table, or simply rerolls."}
        ],
    
    checkInstall = function() {
        log('AdvancedFumbleTable v'+version+' Ready');
	},
    
    replaceTemplateValues = function(result) {
        var message = msgTemplate.replace('!name', result.name).replace('!roll', result.roll).replace('!effect', result.effect);
        if(result.save){
            return message.replace('!save', " {{save="+result.save+"}}");
        } else {
            return message.replace('!save', "");
        }
    },

    writeResult = function(msg, isPrivate, result) {
        var whisperOption = "";
        var speakingAs = msg.who || tableName;
        if(isPrivate) {
            whisperOption = "/w "+msg.who+" ";
            speakingAs = tableName;
        }
        if(result.error) {
            sendChat(tableName, whisperOption + result.message + "\n" + helpMsg);
        } else {
            sendChat(speakingAs, whisperOption + replaceTemplateValues(result));            
        }
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
                name: tableEntry.name,
                effect: tableEntry.effect,
                save: tableEntry.save
            };            
        }
    },

    findEntry = function(params) {
        var name = params.join('').trim().toLowerCase();
        var checkName = function(entry){ return entry.name.toLowerCase().trim().indexOf(name) !== -1 };
        var tableEntry = _.find(table, checkName);
        if(tableEntry === undefined) {
            return {
                error: true,
                message: "Error - no entry found for name '"+name+"'"
            };
        } else {
            return {
                roll: tableEntry.range[0],
                name: tableEntry.name,
                effect: tableEntry.effect,
                save: tableEntry.save
            };            
        }
    },

    getResult = function(params) {
        if(params === undefined || params.length == 0){
            return rollOnTable();
        } else {
            return findEntry(params);
        }
    },

    handleInput = function(msg) {
        var args;
        if(msg.type !== "api") {
            return;
        }
        args = msg.content.split(/\s+/);
        if(args[0] == apiCommand) {
            args.shift();
            if (args[0] == "--help")
                sendChat(tableName, helpMsg);
            else {
                var isPrivate = false;
                if(args[0] == "--private") {
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
     AdvancedFumbleTable.CheckInstall();
     AdvancedFumbleTable.RegisterEventHandlers();
});