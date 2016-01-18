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