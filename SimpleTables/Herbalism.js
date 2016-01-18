// By:       Jefe
// Contact:  https://app.roll20.net/users/451842/jefe
'use strict';

var Herbalism = Herbalism || (function() {

    var version = 0.1,
        rangeMax = 10,
        apiCommand = "!herbalism",
        speakingAs = "Herbalism Table",
        sendMsgTo = "/w GM ",
        msgFormat = sendMsgTo + "(!roll) - !result",
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
            {range: [11], ingredient: "Hydrathistle", additionalRules: "Find 2x the rolled amount"},
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
            {range: [1], ingredient: "Elemental Water", additionalRules: ""}
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
        }


    
    checkInstall = function() {
        log('Herbalism v'+version+' Ready');
	},
    

    writeResult = function(msg, rollResult) {
        sendChat(speakingAs, msgFormat.replace('!roll', rollResult.roll).replace('!result', rollResult.result));
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
                writeResult(msg, rollOnTable());
        }
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