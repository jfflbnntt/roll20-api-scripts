// By:       Jefe
// Contact:  https://app.roll20.net/users/451842/jefe
// Credits to https://www.reddit.com/user/dalagrath for creating the Herbalism and Alchemy supplement which this script is based on
var Herbalism = Herbalism || (function() {
    'use strict';

    var version = 0.2,
        apiCommand = "!herbs",
        helpMsg = "Usage: '"+apiCommand+" [--help|-h] [--private|-w] [biome], where [biome] can be any of common, arctic, coastal, underwater, desert, forest, grasslands, hills, mountain, swamp, underdark, or special. If left blank 'common' will be used. '--help' will return this message. '--private' will return the result in a whisper.",
        tableName = "Herbalism Table",
        msgFormat = "&{template:default} {{name=Herbalism}} {{biome=!biome}} {{roll=!roll}} {{ingredient=!ingredient}} {{amount=!amount}}",
        // rules state chance of special roll is 75-100 on a d100 if 2d6 comes up 2,3,4,10,11,12. This is roughly a 1-9 on a d100 overall chance.
        chanceOfSpecial = 9,
        amountMax = 4,
        commonTable = [
            {range: [2,12], ingredient: "Mandrake Root"},
            {range: [3,4], ingredient: "Quicksilver Lichen"},
            {range: [5,6], ingredient: "Wild Sageroot"},
            {range: [7], ingredient: "Bloodgrass", additionalRules: "Re-roll if not tracking provisions"},
            {range: [8,9], ingredient: "Wyrmtongue Petals"},
            {range: [10,11], ingredient: "Milkweed Seeds"}
        ],
        arcticTable = [
            {range: [2], ingredient: "Silver Hibiscus"},
            {range: [3], ingredient: "Mortflesh Powder"},
            {range: [4], ingredient: "Ironwood Heart"},
            {range: [5], ingredient: "Frozen Seedlings", additionalRules: "Find 2x the rolled amount"},
            {range: [6,7,8], ingredient: "Common Ingredient", additionalRules: "Roll on Common Ingredient table"},
            {range: [9], ingredient: "Arctic Creeper", additionalRules: "Find 2x the rolled amount"},
            {range: [10], ingredient: "Fennel Silk"},
            {range: [11], ingredient: "Fiend's Ivy"},
            {range: [12], ingredient: "Void Root"}
        ],
        underwaterTable = [
            {range: [2], ingredient: "Hydrathistle", additionalRules: "Find 1-2x the rolled amount"},
            {range: [3], ingredient: "Amanita Cap"},
            {range: [4], ingredient: "Hyancinth Nectar"},
            {range: [5], ingredient: "Chromus Slime", additionalRules: "Find 1-2x the rolled amount"},
            {range: [6,7,8], ingredient: "Common Ingredient", additionalRules: "Roll on Common Ingredient table"},
            {range: [9], ingredient: "Lavender Sprig", additionalRules: "Coastal Only"},
            {range: [10], ingredient: "Blue Toadshade", additionalRules: "Coastal Only"},
            {range: [11], ingredient: "Wrackwort Bulbs"},
            {range: [12], ingredient: "Cosmos Glond", additionalRules: "Find 1-2x the rolled amount"}
        ],
        desertTable = [
            {range: [2], ingredient: "Cosmos Glond"},
            {range: [3], ingredient: "Arrow Root"},
            {range: [4], ingredient: "Dried Ephedra"},
            {range: [5], ingredient: "Cactus Juice", additionalRules: "Find 2x the rolled amount"},
            {range: [6,7,8], ingredient: "Common Ingredient", additionalRules: "Roll on Common Ingredient table"},
            {range: [9], ingredient: "Drakus Flower"},
            {range: [10], ingredient: "Scillia Beans"},
            {range: [11], ingredient: "Spineflower Berries"},
            {range: [12], ingredient: "Voidroot", additionalRules: "Come with 1 Elemental Water"}
        ],
        forestTable = [
            {range: [2], ingredient: "Harrada Leaf"},
            {range: [3], ingredient: "Nightshade Berries"},
            {range: [4], ingredient: "Emetic Wax"},
            {range: [5], ingredient: "Verdant Nettle"},
            {range: [6,7,8], ingredient: "Common Ingredient", additionalRules: "Roll on Common Ingredient table"},
            {range: [9], ingredient: "Arrow Root"},
            {range: [10], ingredient: "Ironwood Heart"},
            {range: [11], ingredient: "Blue Toadshade"},
            {range: [12], ingredient: "Wisp Stalks", additionalRules: "Find 2x during Night, Re-roll during Day"}
        ],
        grasslandsTable = [
            {range: [2], ingredient: "Harrada Leaf"},
            {range: [3], ingredient: "Drakus Flower"},
            {range: [4], ingredient: "Lavender Sprig", additionalRules: "Find 2x the rolled amount"},
            {range: [5], ingredient: "Arrow Root"},
            {range: [6,7,8], ingredient: "Common Ingredient", additionalRules: "Roll on Common Ingredient table"},
            {range: [9], ingredient: "Scillia Beans", additionalRules: "Find 2x the rolled amount"},
            {range: [10], ingredient: "Cactus Juice"},
            {range: [11], ingredient: "Tail Leaf"},
            {range: [12], ingredient: "Hyancinth Nectar"}
        ],
        hillsTable = [
            {range: [2], ingredient: "Devil's Bloodleaf"},
            {range: [3], ingredient: "Nightshade Berries"},
            {range: [4], ingredient: "Tail Leaf", additionalRules: "Find 2x the rolled amount"},
            {range: [5], ingredient: "Lavender Sprig"},
            {range: [6,7,8], ingredient: "Common Ingredient", additionalRules: "Roll on Common Ingredient table"},
            {range: [9], ingredient: "Ironwood Heart"},
            {range: [10], ingredient: "Gengko Brush"},
            {range: [11], ingredient: "Rock Vine", additionalRules: "Find 2x the rolled amount"},
            {range: [12], ingredient: "Harrada Leaf"}
        ],
        mountainTable = [
            {range: [2], ingredient: "Basilisk's Breath"},
            {range: [3], ingredient: "Frozen Seedlings", additionalRules: "Find 2x the rolled amount"},
            {range: [4], ingredient: "Arctic Creeper", additionalRules: "Find 2x the rolled amount"},
            {range: [5], ingredient: "Dried Ephedra"},
            {range: [6,7,8], ingredient: "Common Ingredient", additionalRules: "Roll on Common Ingredient table"},
            {range: [9], ingredient: "Drakus Flower"},
            {range: [10], ingredient: "Luminous Cap Dust", additionalRules: "Find 2x the rolled amount in Caves"},
            {range: [11], ingredient: "Rock Vine"},
            {range: [12], ingredient: "Primordial Balm"}
        ],
        swampTable = [
            {range: [2], ingredient: "Devil's Bloodleaf"},
            {range: [3], ingredient: "Spineflower Berries"},
            {range: [4], ingredient: "Emetic Wax"},
            {range: [5], ingredient: "Amanita Cap", additionalRules: "Find 2x the rolled amount"},
            {range: [6,7,8], ingredient: "Common Ingredient", additionalRules: "Roll on Common Ingredient table"},
            {range: [9], ingredient: "Blue Toadshade", additionalRules: "Find 2x the rolled amount"},
            {range: [10], ingredient: "Wrackwort Bulbs"},
            {range: [11], ingredient: "Hydrathistle", additionalRules: "Find 2x the rolled amount in rain"},
            {range: [12], ingredient: "Primordial Balm"}
        ],
        underdarkTable = [
            {range: [2], ingredient: "Primordial Balm", additionalRules: "Find 1-2x the rolled amount"},
            {range: [3], ingredient: "Silver Hibiscus"},
            {range: [4], ingredient: "Devil's Bloodleaf"},
            {range: [5], ingredient: "Chromus Slime"},
            {range: [6], ingredient: "Mortflesh Powder", additionalRules: "Find 2x the rolled amount"},
            {range: [7], ingredient: "Fennel Silk"},
            {range: [8], ingredient: "Fiend's Ivy"},
            {range: [9], ingredient: "Gengko Brush"},
            {range: [10], ingredient: "Luminous Cap Dust", additionalRules: "Find 2x the rolled amount"},
            {range: [11], ingredient: "Radiant Synthseed"},
            {range: [12], ingredient: "Wisp Stalks"}
        ],
        specialTable = [
            {range: [2,3,4,5,6,7,8,9,10,11,12], ingredient: "Elemental Water"}
        ],
        biomeMap = {
            "common": commonTable,
            "arctic": arcticTable,
            "underwater": underwaterTable,
            "coastal": underwaterTable,
            "desert": desertTable,
            "forest": forestTable,
            "grasslands": grasslandsTable,
            "hills": hillsTable,
            "mountain": mountainTable,
            "swamp": swampTable,
            "underdark": underdarkTable,
            "special": specialTable
        },
    
    replaceTemplateValues = function(result) {
        var message = msgFormat.replace('!biome', result.biome).replace('!roll', result.roll).replace('!amount', result.amount).replace('!ingredient', result.ingredient);
        if(result.additionalRules){
            return message + " {{notes="+result.additionalRules+"}}";
        } else {
            return message;
        }
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

    rollOnTable = function(params) {
        var biomeName, biomeTable;
        biomeName = params[0] || "common";
        if(randomInteger(100) <= chanceOfSpecial)
            biomeName = "special";
        biomeTable = biomeMap[biomeName];
        if(biomeTable === undefined) {
            return {
                error: true,
                message: "Unknown biome '"+biomeName+"'"
            };
        } else {
            var roll = randomInteger(6) + randomInteger(6);
            var checkRange = function(entry){ return entry.range.indexOf(roll) !== -1 };
            var entry = _.find(biomeTable, checkRange);
            return {
                biome: biomeName,
                roll: roll,
                amount: randomInteger(amountMax),
                ingredient: entry.ingredient,
                additionalRules: entry.additionalRules
            };                        
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
            if (args[0] == "--help" || args[0] == "-h")
                sendChat(tableName, helpMsg);
            else {
                var isPrivate = false;
                if(args[0] == "--private" || args[0] == "-w") {
                    isPrivate = true;
                    args.shift();
                }
                writeResult(msg, isPrivate, rollOnTable(args));
            }
        }
    },

    checkInstall = function() {
        log(tableName+' v'+version+' Ready');
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
    Herbalism.CheckInstall();
    Herbalism.RegisterEventHandlers();
});