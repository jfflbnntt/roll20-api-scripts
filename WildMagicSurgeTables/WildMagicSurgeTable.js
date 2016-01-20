// By:       Jefe
// Contact:  https://app.roll20.net/users/451842/jefe
var WildMagicSurgeTable = WildMagicSurgeTable || (function() {
    'use strict';

    var version = 0.1,
        rangeMax = 100,
        apiCommand = "!wildmagic",
        helpMsg = "Usage - !wildmagic [--private], rolls on the wildmagic table, optionally whispers result to roller if --private is used.",
        tableName = "Wild Magic Table",
        msgTemplate = "&{template:default} {{name=Wild Magic Surge}} {{roll=!roll}} {{result=!result}}",
        table = [
            {range: [1,2], result: "Roll on this table at the start of each of your turns for the next minute, ignoring this result on subsequent rolls."},
            {range: [3,4], result: "For the next minute, you can see any invisible creature to which you have line of sight."},
            {range: [5,6], result: "A MODRON chosen and controlled by the DM appears in an unoccupied space within 5ft of you, then disappears 1 minute later."},
            {range: [7,8], result: "You cast FIREBALL as a 3rd level spell, centered on yourself."},
            {range: [9,10], result: "You cast MAGIC MISSLE as a 5th level spell"},
            {range: [11,12], result: "Your height changes [[d10]] inches.  You shrink if the number is Odd, grow if the number is even."},
            {range: [13,14], result: "You cast CONFUSION centered on yourself." },
            {range: [15,16], result: "For the next minute you gain 5hp at the start of each of your turns." },
            {range: [17,18], result: "You grow a long beard made of feathers that remains on your face until you sneeze, at which point the beard explodes out from your face." },
            {range: [19,20], result: "You cast GREASE centered on yourself." },
            {range: [21,22], result: "Creatures have disadvantage on saving throws against the next spell you cast that requires a saving throw in the next minute." },
            {range: [23,24], result: "Your skin turns a vibrant shade of Blue.  A REMOVE CURSE spell can end this effect." },
            {range: [25,26], result: "An eye appears in the center of your forehead for the next minute.  You gain advantage on Perception checks that involve sight." },
            {range: [27,28], result: "For the next minute, all your spells with a casting time of 1 action now have a casting time of 1 bonus action." },
            {range: [29,30], result: "You teleport up to 60ft to an unoccupied space of your choice that you can see." },
            {range: [31,32], result: "You are transported to the Astral Plane until the end of your next turn, after which time you return to the space you previously occupied, or the nearest space that isn't." },
            {range: [33,34], result: "Maximize the damage of the next damaging spell you cast within the next minute." },
            {range: [35,36], result: "Your age changes [[d10]] years.  You age if the number is Odd, become younger if the number is even."},
            {range: [37,38], result: "[[1d6]] FLUMPHS controlled by the DM appear in unoccupied spaces within 60ft of you and are frightened of you.  They vanish after 1 minute."},
            {range: [39,40], result: "You regain [[2d10]] hit points."},
            {range: [41,42], result: "You turn into a potted plant until the start of your next turn.  While a plant, you are incapacitated and have vulnerability to all damage.  If you drop to 0 hit points, your pot breaks and you revert to your form."},
            {range: [43,44], result: "For the next minute, you can teleport up to 20ft as a bonus action on each of your turns."},
            {range: [45,46], result: "You cast LEVITATE on yourself."},
            {range: [47,48], result: "A UNICORN controlled by the DM appears in an unoccupied space within 5ft of you, then disappears 1 minute later."},
            {range: [49,50], result: "You can't speak for the next minute.  Whenever you try, pink bubbles float out of your mouth."},
            {range: [51,52], result: "A spectral shield hovers near you for the next minute, granting you a +2 bonus to AC and immunity to MAGIC MISSLE."},
            {range: [53,54], result: "You are immune to being intoxicated by alcohol for the next [[5d6]] days."},
            {range: [55,56], result: "Your hair falls out, but grows back within the next 24hrs."},
            {range: [57,58], result: "For the next minute, any flammable object you touch that isn't being worn or carried by another creature bursts into flame."},
            {range: [59,60], result: "You regain your lowest-level expended spell slot."},
            {range: [61,62], result: "For the next minute, you must shout when you speak."},
            {range: [63,64], result: "You cast FOG CLOUD centered on yourself."},
            {range: [65,66], result: "Up to three creatures you choose within 30ft of you take [[4d10]] lightning damage."},
            {range: [67,68], result: "You are frightened of the nearest creature until the end of your next turn."},
            {range: [69,70], result: "Each creature within 30ft of you becomes invisible for the next minute.  The invisibility ends on a creature when it attacks or casts a spell."},
            {range: [71,72], result: "You gain resistance to all damage for the next minute."},
            {range: [73,74], result: "A random creature within 60ft of you becomes poisoned for [[1d4]] hours."},
            {range: [75,76], result: "You glow with bright light in a 30-foot radius for the next minute.  Any creature that ends its turn within 5ft of you is blinded until the end of its next turn."},
            {range: [77,78], result: "You cast POLYMORPH on yourself.  If you fail the saving throw, you turn into a sheep for the spell's duration."},
            {range: [79,80], result: "Illusory butterflies and flower petals flutter in the air within 10ft of you for the next minute."},
            {range: [81,82], result: "You can take one additional action immediately."},
            {range: [83,84], result: "Each creature within 30ft of you takes [[1d10]] Necrotic damage.  You regain hit points equal to the sum of the damage dealt."},
            {range: [85,86], result: "You cast MIRROR IMAGE."},
            {range: [87,88], result: "You cast FLY on a random creature within 60ft of you."},
            {range: [89,90], result: "You become invisible for the next minute.  During that time, other creatures cannot hear you.  The invisibility ends if you attack or cast a spell."},
            {range: [91,92], result: "If you die within the next minute, you immediately come back to life as if by a REINCARNATE spell."},
            {range: [93,94], result: "Your size increases by 1 category for the next minute."},
            {range: [95,96], result: "You and all creatures within 30ft of you gain vulnerability to piercing damage for the next minute."},
            {range: [97,98], result: "You are surrounded by faint, ethereal music for the next minute."},
            {range: [99,100], result: "You regain all expended Sorcery Points!"},
         ],   


    
    checkInstall = function() {
        log('WildMagicSurgeTable v'+version+' Ready');
	},
    

    writeResult = function(msg, rollResult, isPrivate) {
        var message = msgTemplate.replace('!roll', rollResult.roll).replace('!result', rollResult.result)
        var speakingAs = msg.who || tableName;
        if(isPrivate){
            message = "/w "+msg.who+" "+message;
            speakingAs = tableName;
        }
        sendChat(speakingAs, message);
    },

    rollOnTable = function() {
        var roll = randomInteger(rangeMax);
        var checkRange = function(entry){ return entry.range.indexOf(roll) !== -1 };
        var tableEntry = _.find(table, checkRange);
        return {
            roll: roll,
            result: tableEntry.result
        };
    },

    handleInput = function(msg) {
        var args;
        if(msg.type !== "api") {
            return;
        }
        args = msg.content.split(/\s+/);
        switch(args[0]) {
            case apiCommand:
                if(args[1] == "--help")
                    sendChat(tableName, helpMsg);
                else {
                    var isPrivate = false;
                    if(args[1] == "--private")
                        isPrivate = true;
                    writeResult(msg, rollOnTable(), isPrivate);                    
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
    WildMagicSurgeTable.CheckInstall();
    WildMagicSurgeTable.RegisterEventHandlers();
});