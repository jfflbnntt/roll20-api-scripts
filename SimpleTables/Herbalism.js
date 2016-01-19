// By:       Jefe
// Contact:  https://app.roll20.net/users/451842/jefe
// Credits to https://www.reddit.com/user/dalagrath for creating the Herbalism and Alchemy supplement which this script is based on
'use strict';

var Herbalism = Herbalism || (function() {

    var version = 0.1,
        apiCommand = "!herbalism",
        helpCommand = "!herbalism-help",
        helpMsg = "Herbalism Script Usage: '"+apiCommand+" [terrain type]' where [terrain-type] can be any of common, arctic, underwater, desert, forest, grasslands, hills, mountain, swamp, underdark, or special. If left blank 'common' will be used.",
        speakingAs = "Herbalism Table",
        sendMsgTo = "/w GM ",
        msgFormat = sendMsgTo + "(!roll) - x!amount '!ingredient' !additionalRules",
        // rules state chance of special roll is 75-100 on a d100 if 2d6 comes up 2,3,4,10,11,12. This is roughly a 1-9 on a d100 overall chance.
        chanceOfSpecial = 9,
        amountMax = 4,
        commonTable = [
            {range: [2,12], ingredient: "Mandrake Root", additionalRules: ""},
            {range: [3,4], ingredient: "Quicksilver Lichen", additionalRules: ""},
            {range: [5,6], ingredient: "Wild Sageroot", additionalRules: ""},
            {range: [7], ingredient: "Bloodgrass", additionalRules: "Re-roll if not tracking provisions"},
            {range: [8,9], ingredient: "Wyrmtongue Petals", additionalRules: ""},
            {range: [10,11], ingredient: "Milkweed Seeds", additionalRules: ""}
        ],
        arcticTable = [
            {range: [2], ingredient: "Silver Hibiscus", additionalRules: ""},
            {range: [3], ingredient: "Mortflesh Powder", additionalRules: ""},
            {range: [4], ingredient: "Ironwood Heart", additionalRules: ""},
            {range: [5], ingredient: "Frozen Seedlings", additionalRules: "Find 2x the rolled amount"},
            {range: [6,7,8], ingredient: "Common Ingredient", additionalRules: "Roll on Common Ingredient table"},
            {range: [9], ingredient: "Arctic Creeper", additionalRules: "Find 2x the rolled amount"},
            {range: [10], ingredient: "Fennel Silk", additionalRules: ""},
            {range: [11], ingredient: "Fiend's Ivy", additionalRules: ""},
            {range: [12], ingredient: "Void Root", additionalRules: ""}
        ],
        underwaterTable = [
            {range: [2], ingredient: "Hydrathistle", additionalRules: "Find 1-2x the rolled amount"},
            {range: [3], ingredient: "Amanita Cap", additionalRules: ""},
            {range: [4], ingredient: "Hyancinth Nectar", additionalRules: ""},
            {range: [5], ingredient: "Chromus Slime", additionalRules: "Find 1-2x the rolled amount"},
            {range: [6,7,8], ingredient: "Common Ingredient", additionalRules: "Roll on Common Ingredient table"},
            {range: [9], ingredient: "Lavender Sprig", additionalRules: "Coastal Only"},
            {range: [10], ingredient: "Blue Toadshade", additionalRules: "Coastal Only"},
            {range: [11], ingredient: "Wrackwort Bulbs", additionalRules: ""},
            {range: [12], ingredient: "Cosmos Glond", additionalRules: "Find 1-2x the rolled amount"}
        ],
        desertTable = [
            {range: [2], ingredient: "Cosmos Glond", additionalRules: ""},
            {range: [3], ingredient: "Arrow Root", additionalRules: ""},
            {range: [4], ingredient: "Dried Ephedra", additionalRules: ""},
            {range: [5], ingredient: "Cactus Juice", additionalRules: "Find 2x the rolled amount"},
            {range: [6,7,8], ingredient: "Common Ingredient", additionalRules: "Roll on Common Ingredient table"},
            {range: [9], ingredient: "Drakus Flower", additionalRules: ""},
            {range: [10], ingredient: "Scillia Beans", additionalRules: ""},
            {range: [11], ingredient: "Spineflower Berries", additionalRules: ""},
            {range: [12], ingredient: "Voidroot", additionalRules: "Come with 1 Elemental Water"}
        ],
        forestTable = [
            {range: [2], ingredient: "Harrada Leaf", additionalRules: ""},
            {range: [3], ingredient: "Nightshade Berries", additionalRules: ""},
            {range: [4], ingredient: "Emetic Wax", additionalRules: ""},
            {range: [5], ingredient: "Verdant Nettle", additionalRules: ""},
            {range: [6,7,8], ingredient: "Common Ingredient", additionalRules: "Roll on Common Ingredient table"},
            {range: [9], ingredient: "Arrow Root", additionalRules: ""},
            {range: [10], ingredient: "Ironwood Heart", additionalRules: ""},
            {range: [11], ingredient: "Blue Toadshade", additionalRules: ""},
            {range: [12], ingredient: "Wisp Stalks", additionalRules: "Find 2x during Night, Re-roll during Day"}
        ],
        grasslandsTable = [
            {range: [2], ingredient: "Harrada Leaf", additionalRules: ""},
            {range: [3], ingredient: "Drakus Flower", additionalRules: ""},
            {range: [4], ingredient: "Lavender Sprig", additionalRules: "Find 2x the rolled amount"},
            {range: [5], ingredient: "Arrow Root", additionalRules: ""},
            {range: [6,7,8], ingredient: "Common Ingredient", additionalRules: "Roll on Common Ingredient table"},
            {range: [9], ingredient: "Scillia Beans", additionalRules: "Find 2x the rolled amount"},
            {range: [10], ingredient: "Cactus Juice", additionalRules: ""},
            {range: [11], ingredient: "Tail Leaf", additionalRules: ""},
            {range: [12], ingredient: "Hyancinth Nectar", additionalRules: ""}
        ],
        hillsTable = [
            {range: [2], ingredient: "Devil's Bloodleaf", additionalRules: ""},
            {range: [3], ingredient: "Nightshade Berries", additionalRules: ""},
            {range: [4], ingredient: "Tail Leaf", additionalRules: "Find 2x the rolled amount"},
            {range: [5], ingredient: "Lavender Sprig", additionalRules: ""},
            {range: [6,7,8], ingredient: "Common Ingredient", additionalRules: "Roll on Common Ingredient table"},
            {range: [9], ingredient: "Ironwood Heart", additionalRules: ""},
            {range: [10], ingredient: "Gengko Brush", additionalRules: ""},
            {range: [11], ingredient: "Rock Vine", additionalRules: "Find 2x the rolled amount"},
            {range: [12], ingredient: "Harrada Leaf", additionalRules: ""}
        ],
        mountainTable = [
            {range: [2], ingredient: "Basilisk's Breath", additionalRules: ""},
            {range: [3], ingredient: "Frozen Seedlings", additionalRules: "Find 2x the rolled amount"},
            {range: [4], ingredient: "Arctic Creeper", additionalRules: "Find 2x the rolled amount"},
            {range: [5], ingredient: "Dried Ephedra", additionalRules: ""},
            {range: [6,7,8], ingredient: "Common Ingredient", additionalRules: "Roll on Common Ingredient table"},
            {range: [9], ingredient: "Drakus Flower", additionalRules: ""},
            {range: [10], ingredient: "Luminous Cap Dust", additionalRules: "Find 2x the rolled amount in Caves"},
            {range: [11], ingredient: "Rock Vine", additionalRules: ""},
            {range: [12], ingredient: "Primordial Balm", additionalRules: ""}
        ],
        swampTable = [
            {range: [2], ingredient: "Devil's Bloodleaf", additionalRules: ""},
            {range: [3], ingredient: "Spineflower Berries", additionalRules: ""},
            {range: [4], ingredient: "Emetic Wax", additionalRules: ""},
            {range: [5], ingredient: "Amanita Cap", additionalRules: "Find 2x the rolled amount"},
            {range: [6,7,8], ingredient: "Common Ingredient", additionalRules: "Roll on Common Ingredient table"},
            {range: [9], ingredient: "Blue Toadshade", additionalRules: "Find 2x the rolled amount"},
            {range: [10], ingredient: "Wrackwort Bulbs", additionalRules: ""},
            {range: [11], ingredient: "Hydrathistle", additionalRules: "Find 2x the rolled amount in rain"},
            {range: [12], ingredient: "Primordial Balm", additionalRules: ""}
        ],
        underdarkTable = [
            {range: [2], ingredient: "Primordial Balm", additionalRules: "Find 1-2x the rolled amount"},
            {range: [3], ingredient: "Silver Hibiscus", additionalRules: ""},
            {range: [4], ingredient: "Devil's Bloodleaf", additionalRules: ""},
            {range: [5], ingredient: "Chromus Slime", additionalRules: ""},
            {range: [6], ingredient: "Mortflesh Powder", additionalRules: "Find 2x the rolled amount"},
            {range: [7], ingredient: "Fennel Silk", additionalRules: ""},
            {range: [8], ingredient: "Fiend's Ivy", additionalRules: ""},
            {range: [9], ingredient: "Gengko Brush", additionalRules: ""},
            {range: [10], ingredient: "Luminous Cap Dust", additionalRules: "Find 2x the rolled amount"},
            {range: [11], ingredient: "Radiant Synthseed", additionalRules: ""},
            {range: [12], ingredient: "Wisp Stalks", additionalRules: ""}
        ],
        specialTable = [
            {range: [2,3,4,5,6,7,8,9,10,11,12], ingredient: "Elemental Water", additionalRules: ""}
        ],
        terrainMap = {
            "common": commonTable,
            "arctic": arcticTable,
            "underwater": underwaterTable,
            "costal": underwaterTable,
            "desert": desertTable,
            "forest": forestTable,
            "grasslands": grasslandsTable,
            "hills": hillsTable,
            "mountain": mountainTable,
            "swamp": swampTable,
            "underdark": underdarkTable,
            "special": specialTable
        };
    
    checkInstall = function() {
        log('Herbalism v'+version+' Ready');
	},
    

    writeResult = function(msg, rollResult) {
        if(rollResult.error) {
            sendChat(speakingAs, "Unknown terrain-type '"+rollResult.terrain+"'");            
        } else {
            sendChat(speakingAs, msgFormat.replace('!roll', rollResult.roll).replace('!amount', rollResult.amount).replace('!ingredient', rollResult.ingredient).replace('!additionalRules',rollResult.additionalRules));            
        }
    },

    rollOnTable = function(terrain) {
        var roll, specialRoll, amountRoll, terrainKey, terrainTable;
        terrainKey = terrain;
        specialRoll = randomInteger(100);
        if(specialRoll <= chanceOfSpecial)
            terrainKey = "special";
        terrainTable = terrainMap[terrainKey];
        if(terrainTable === undefined) {
            return {
                error: true,
                terrain: terrainKey
            };
        } else {
            roll = randomInteger(6) + randomInteger(6);
            amount = randomInteger(amountMax);
            var checkRange = function(entry){ return entry.range.indexOf(roll) !== -1 };
            var tableEntry = _.find(terrainTable, checkRange);
            return {
                error: false,
                terrain: terrainKey,
                roll: roll,
                amount: amount,
                ingredient: tableEntry.ingredient,
                additionalRules: tableEntry.additionalRules
            };                        
        };
    },

    handleInput = function(msg) {
        var args, terrain;
        if(msg.type !== "api") {
            return;
        };
        args = msg.content.split(/\s+/);
        if(args[0] == apiCommand){
            terrain = 'common';
            if(args.length > 1) {
                terrain = args[1];
            }
            writeResult(msg, rollOnTable(terrain));
        } else if (args[0] == helpCommand) {
            sendChat(speakingAs, helpMsg);
        };
    },

    init = function() {
        checkInstall();
        on("chat:message", handleInput);
    };

    return {
		init: init
	};
}());

on('ready', function() {
    Herbalism.init();
});