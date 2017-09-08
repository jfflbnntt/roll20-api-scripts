// By:       Jefe
// Contact:  https://app.roll20.net/users/451842/jefe
// Credits to https://www.reddit.com/user/dalagrath for creating the Herbalism and Alchemy supplement which this script is based on
var Herbalism = Herbalism || (function() {
    'use strict';

    //config values
    var version = 0.4,
        helpMsg = "Usage: [!herbalism|!herbs] [--help|-h] [--private|-w] [terrain], where [terrain] can be any of common, arctic, coastal, underwater, desert, forest, grasslands, hills, mountain, swamp, underdark, or special. If left blank 'common' will be used. '--help' will return this message. '--private' will return the result in a whisper.",
        tableName = "Herbalism Table",
        msgFormat = "&{template:default} {{name=Herbalism}} {{terrain=!terrain}} {{roll=!roll}} {{ingredient=!ingredient}} {{amount=!amount}}",
        // rules state chance of special roll is 75-100 on a d100 if 2d6 comes up 2,3,4,10,11,12. This is roughly a 1-9 on a d100 overall chance.
        chanceOfSpecial = 9,
        // settings for various amounts
        specialMax = 1,
        rareMax = 2,
        uncommonMax = 3,
        commonMax = 4,
        // change to false if you don't want to auto-roll common ingredients
        autoRollIfCommon = true,
        // change to true if you want to auto-reroll bloodgrass
        autoReRerollIfBloodgrass = false,
        // Table Entries
        // common ingredients
        commonTable = [
            {range: [2,12],     ingredient: "Mandrake Root"},
            {range: [3,4],      ingredient: "Quicksilver Lichen"},
            {range: [5,6],      ingredient: "Wild Sageroot"},
            {range: [7],        ingredient: "Bloodgrass",           amount: commonMax,          additionalRules: "Re-roll if not tracking provisions"},
            {range: [8,9],      ingredient: "Wyrmtongue Petals"},
            {range: [10,11],    ingredient: "Milkweed Seeds"}
        ],
        // arctic ingredients
        arcticTable = [
            {range: [2],        ingredient: "Silver Hibiscus",      amount: rareMax},
            {range: [3],        ingredient: "Mortflesh Powder",     amount: uncommonMax},
            {range: [4],        ingredient: "Ironwood Heart",       amount: uncommonMax},
            {range: [5],        ingredient: "Frozen Seedlings",     amount: uncommonMax,        additionalRules: "Find 2x the rolled amount"},
            {range: [6,7,8],    ingredient: "Common Ingredient",    amount: commonMax,          additionalRules: "Roll on Common Ingredient table"},
            {range: [9],        ingredient: "Arctic Creeper",       amount: uncommonMax,        additionalRules: "Find 2x the rolled amount"},
            {range: [10],       ingredient: "Fennel Silk",          amount: uncommonMax},
            {range: [11],       ingredient: "Fiend's Ivy",          amount: uncommonMax},
            {range: [12],       ingredient: "Void Root",            amount: rareMax}
        ],
        // underwater ingredients
        underwaterTable = [
            {range: [2],        ingredient: "Hydrathistle",         amount: rareMax,            additionalRules: "Find 1-2x the rolled amount"},
            {range: [3],        ingredient: "Amanita Cap",          amount: uncommonMax},
            {range: [4],        ingredient: "Hyancinth Nectar",     amount: uncommonMax},
            {range: [5],        ingredient: "Chromus Slime",        amount: uncommonMax,        additionalRules: "Find 1-2x the rolled amount"},
            {range: [6,7,8],    ingredient: "Common Ingredient",    amount: commonMax,          additionalRules: "Roll on Common Ingredient table"},
            {range: [9],        ingredient: "Lavender Sprig",       amount: uncommonMax,        additionalRules: "Coastal Only"},
            {range: [10],       ingredient: "Blue Toadshade",       amount: uncommonMax,        additionalRules: "Coastal Only"},
            {range: [11],       ingredient: "Wrackwort Bulbs",      amount: uncommonMax},
            {range: [12],       ingredient: "Cosmos Glond",         amount: rareMax,            additionalRules: "Find 1-2x the rolled amount"}
        ],
        // desert ingredients
        desertTable = [
            {range: [2],        ingredient: "Cosmos Glond",         amount: rareMax},
            {range: [3],        ingredient: "Arrow Root",           amount: uncommonMax},
            {range: [4],        ingredient: "Dried Ephedra",        amount: uncommonMax},
            {range: [5],        ingredient: "Cactus Juice",         amount: uncommonMax,        additionalRules: "Find 2x the rolled amount"},
            {range: [6,7,8],    ingredient: "Common Ingredient",    amount: commonMax,          additionalRules: "Roll on Common Ingredient table"},
            {range: [9],        ingredient: "Drakus Flower",        amount: uncommonMax},
            {range: [10],       ingredient: "Scillia Beans",        amount: uncommonMax},
            {range: [11],       ingredient: "Spineflower Berries",  amount: uncommonMax},
            {range: [12],       ingredient: "Voidroot",             amount: rareMax,            additionalRules: "Come with 1 Elemental Water"}
        ],
        // forest ingredients
        forestTable = [
            {range: [2],        ingredient: "Harrada Leaf",         amount: rareMax},
            {range: [3],        ingredient: "Nightshade Berries",   amount: uncommonMax},
            {range: [4],        ingredient: "Emetic Wax",           amount: uncommonMax},
            {range: [5],        ingredient: "Verdant Nettle",       amount: uncommonMax},
            {range: [6,7,8],    ingredient: "Common Ingredient",    amount: commonMax,          additionalRules: "Roll on Common Ingredient table"},
            {range: [9],        ingredient: "Arrow Root",           amount: uncommonMax},
            {range: [10],       ingredient: "Ironwood Heart",       amount: uncommonMax},
            {range: [11],       ingredient: "Blue Toadshade",       amount: uncommonMax},
            {range: [12],       ingredient: "Wisp Stalks",          amount: rareMax,            additionalRules: "Find 2x during Night, Re-roll during Day"}
        ],
        // grasslands ingredients
        grasslandsTable = [
            {range: [2],        ingredient: "Harrada Leaf",         amount: rareMax},
            {range: [3],        ingredient: "Drakus Flower",        amount: uncommonMax},
            {range: [4],        ingredient: "Lavender Sprig",       amount: uncommonMax,        additionalRules: "Find 2x the rolled amount"},
            {range: [5],        ingredient: "Arrow Root",           amount: uncommonMax},
            {range: [6,7,8],    ingredient: "Common Ingredient",    amount: commonMax,          additionalRules: "Roll on Common Ingredient table"},
            {range: [9],        ingredient: "Scillia Beans",        amount: uncommonMax,        additionalRules: "Find 2x the rolled amount"},
            {range: [10],       ingredient: "Cactus Juice",         amount: uncommonMax},
            {range: [11],       ingredient: "Tail Leaf",            amount: uncommonMax},
            {range: [12],       ingredient: "Hyancinth Nectar",     amount: rareMax}
        ],
        // hill ingredients
        hillsTable = [
            {range: [2],        ingredient: "Devil's Bloodleaf",    amount: rareMax},
            {range: [3],        ingredient: "Nightshade Berries",   amount: uncommonMax},
            {range: [4],        ingredient: "Tail Leaf",            amount: uncommonMax,        additionalRules: "Find 2x the rolled amount"},
            {range: [5],        ingredient: "Lavender Sprig",       amount: uncommonMax},
            {range: [6,7,8],    ingredient: "Common Ingredient",    amount: commonMax,          additionalRules: "Roll on Common Ingredient table"},
            {range: [9],        ingredient: "Ironwood Heart",       amount: uncommonMax},
            {range: [10],       ingredient: "Gengko Brush",         amount: uncommonMax},
            {range: [11],       ingredient: "Rock Vine",            amount: uncommonMax,        additionalRules: "Find 2x the rolled amount"},
            {range: [12],       ingredient: "Harrada Leaf",         amount: rareMax}
        ],
        // mountain ingredients
        mountainTable = [
            {range: [2],        ingredient: "Basilisk's Breath",    amount: rareMax},
            {range: [3],        ingredient: "Frozen Seedlings",     amount: uncommonMax,        additionalRules: "Find 2x the rolled amount"},
            {range: [4],        ingredient: "Arctic Creeper",       amount: uncommonMax,        additionalRules: "Find 2x the rolled amount"},
            {range: [5],        ingredient: "Dried Ephedra",        amount: uncommonMax},
            {range: [6,7,8],    ingredient: "Common Ingredient",    amount: commonMax,          additionalRules: "Roll on Common Ingredient table"},
            {range: [9],        ingredient: "Drakus Flower",        amount: uncommonMax},
            {range: [10],       ingredient: "Luminous Cap Dust",    amount: uncommonMax,        additionalRules: "Find 2x the rolled amount in Caves"},
            {range: [11],       ingredient: "Rock Vine",            amount: uncommonMax},
            {range: [12],       ingredient: "Primordial Balm",      amount: rareMax}
        ],
        // swamp ingredients
        swampTable = [
            {range: [2],        ingredient: "Devil's Bloodleaf",    amount: rareMax},
            {range: [3],        ingredient: "Spineflower Berries",  amount: uncommonMax},
            {range: [4],        ingredient: "Emetic Wax",           amount: uncommonMax},
            {range: [5],        ingredient: "Amanita Cap",          amount: uncommonMax,        additionalRules: "Find 2x the rolled amount"},
            {range: [6,7,8],    ingredient: "Common Ingredient",    amount: commonMax,          additionalRules: "Roll on Common Ingredient table"},
            {range: [9],        ingredient: "Blue Toadshade",       amount: uncommonMax,        additionalRules: "Find 2x the rolled amount"},
            {range: [10],       ingredient: "Wrackwort Bulbs",      amount: uncommonMax},
            {range: [11],       ingredient: "Hydrathistle",         amount: uncommonMax,        additionalRules: "Find 2x the rolled amount in rain"},
            {range: [12],       ingredient: "Primordial Balm",      amount: rareMax}
        ],
        // underdark ingredients
        underdarkTable = [
            {range: [2],        ingredient: "Primordial Balm",      amount: rareMax,            additionalRules: "Find 1-2x the rolled amount"},
            {range: [3],        ingredient: "Silver Hibiscus",      amount: uncommonMax},
            {range: [4],        ingredient: "Devil's Bloodleaf",    amount: uncommonMax},
            {range: [5],        ingredient: "Chromus Slime",        amount: uncommonMax},
            {range: [6],        ingredient: "Mortflesh Powder",     amount: commonMax,          additionalRules: "Find 2x the rolled amount"},
            {range: [7],        ingredient: "Fennel Silk",          amount: commonMax},
            {range: [8],        ingredient: "Fiend's Ivy",          amount: commonMax},
            {range: [9],        ingredient: "Gengko Brush",         amount: uncommonMax},
            {range: [10],       ingredient: "Luminous Cap Dust",    amount: uncommonMax,        additionalRules: "Find 2x the rolled amount"},
            {range: [11],       ingredient: "Radiant Synthseed",    amount: uncommonMax},
            {range: [12],       ingredient: "Wisp Stalks",          amount: rareMax}
        ],
        // special ingredients
        specialTable = [
            {range: [2,3,4,5,6,7,8,9,10,11,12],     ingredient: "Elemental Water",      amount: specialMax}
        ],
        // mapping between terrain name and ingredient tables
        terrainMap = {
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
        var message = msgFormat.replace('!terrain', result.terrain).replace('!roll', result.roll).replace('!amount', result.amount).replace('!ingredient', result.ingredient);
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

    rollOnTable = function(terrain) {
        var terrainName, terrainTable;
        terrainName = terrain || "common";
        //exclude 'common' from special chance
        if(terrainName != "common" && randomInteger(100) <= chanceOfSpecial)
            terrainName = "special";
        terrainTable = terrainMap[terrainName];
        if(terrainTable === undefined) {
            return {
                error: true,
                message: "Unknown terrain '"+terrainName+"'"
            };
        } else {
            var roll = randomInteger(6) + randomInteger(6);
            var checkRange = function(entry){ return entry.range.indexOf(roll) !== -1 };
            var entry = _.find(terrainTable, checkRange);
            if(entry.ingredient == "Bloodgrass" && autoReRerollIfBloodgrass) {
                return rollOnTable(terrain);
            }
            if(entry.ingredient == "Common Ingredient" && autoRollIfCommon) {
                return rollOnTable("common");
            }
            return {
                terrain: terrainName,
                roll: roll,
                amount: randomInteger(entry.amount || commonMax),
                ingredient: entry.ingredient,
                additionalRules: entry.additionalRules
            };                        
        }
    },

    handleInput = function(msg) {
        var args, command, param;
        if(msg.type !== "api") {
            return;
        }
        args = msg.content.split(/\s+/);
        command = args.shift();
        switch (command) {
            case "!herbs":
            case "!herbalism":
                param = args.shift();
                if (param == "--help" || param == "-h")
                    sendChat(tableName, helpMsg);
                else {
                    var isPrivate = false;
                    if(param == "--private" || param == "-w") {
                        isPrivate = true;
                        param = args.shift();
                    }
                    writeResult(msg, isPrivate, rollOnTable(param));
                }
                return;
        }
    },

    checkInstall = function() {
        log(tableName+' v'+version+' Ready');
    },

    registerEventHandlers = function() {
        on("chat:message", handleInput);
    };

    return {
		checkInstall: checkInstall,
        registerEventHandlers: registerEventHandlers
	};
}());

on('ready', function() {
    'use strict';
    Herbalism.checkInstall();
    Herbalism.registerEventHandlers();
});