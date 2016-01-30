// By:       Jefe
// Contact:  https://app.roll20.net/users/451842/jefe
// Credits: originally created by Stephen S. https://app.roll20.net/users/135636/stephen-s
// https://app.roll20.net/forum/post/1397909/script-dungeon-buddies-inspired-speech-balloons
var SpeechBalloon = SpeechBalloon || (function(){
    'use strict';

    var version = 0.3,
        schemaVersion = 0.5,
        defaultShowLength = 4, // seconds
        checkStepRate = 500, //ms  = 1 second
        bubbleBorderSrc = "https://s3.amazonaws.com/files.d20.io/images/6565520/qJVbhBJQAw7FNDzBubKuNg/thumb.png?1417619659",
        bubbleTailSrc = "https://s3.amazonaws.com/files.d20.io/images/6565493/BMPVhSPmlFaY_KyB7K8XHQ/thumb.png?1417619533",
        bubbleFillSrc = "https://s3.amazonaws.com/files.d20.io/images/6565524/yTHHF5NwFJcd0ddZ-9nyxg/thumb.png?1417619728",


    bustBalloon = function(bubble) {
        var border, tail, fill, text;
        if (typeof(bubble) != "undefined") {
            border = getObj("graphic" , bubble.borderId);
            if(border) { border.remove(); }

            tail = getObj("graphic" , bubble.tailId);
            if(tail) { tail.remove(); }

            fill = getObj("graphic" , bubble.fillId);
            if(fill) { fill.remove(); }

            text = getObj("text" , bubble.textId);
            if(text) { text.remove();}
        }
    },

    cleanState = function() {
        log('SpeechBalloon: Resetting state');
        /* Default Settings stored in the state. */
        state.SpeechBalloon = {
            version: schemaVersion,
            shownBubbles: [],
            queue: [],
        };
    },

    checkBubbleDisplay = function() {
        // show new balloons
        if( state.SpeechBalloon.queue.length > 0 ) {
            speechBalloon(state.SpeechBalloon.queue.shift());
        }
        // remove old balloons
        if(state.SpeechBalloon.shownBubbles.length > 0 && _.first(state.SpeechBalloon.shownBubbles).validUntil < Date.now()) {
            bustBalloon(state.SpeechBalloon.shownBubbles.shift());
        }
    },

    findOrCreateBubbleParts = function(thisMap,thisX,thisY,bubble) {
        var bubbleBorder, bubbleTail, bubbleFill, bubbleText, 
            creationDefaults = {
                _pageid: thisMap.id,
                top: thisY,
                left: thisX,
                width: 70,
                height: 70,
                layer: "gmlayer",
            };

        if(typeof(bubble) != "undefined") {
            bubbleBorder = getObj("graphic", bubble.borderId);
            bubbleTail = getObj("graphic", bubble.tailId);
            bubbleFill = getObj("graphic", bubble.fillId);
            bubbleText = getObj("text", bubble.textId);
        } 

        if(! bubbleBorder) {
            bubbleBorder = fixNewObject(createObj("graphic", _.defaults({
                imgsrc: bubbleBorderSrc
            },creationDefaults)));
        }

        if(! bubbleTail) {
            bubbleTail = fixNewObject(createObj("graphic", _.defaults({
                width: 140,
                height: 140,
                imgsrc: bubbleTailSrc
            },creationDefaults)));            
        }

        if(! bubbleFill ) {
            bubbleFill = fixNewObject(createObj("graphic", _.defaults({
                imgsrc: bubbleFillSrc
            },creationDefaults)));            
        }

        if(! bubbleText ) {
            bubbleText = fixNewObject(createObj("text", _.defaults({
                text: "DoubleBubbleBumBubblesDouble",
                font_size: 16,
                color: "rgb(0,0,0)",
                font_family: "Courier"
            },creationDefaults)));            
        }

        return {
            bubbleBorder: bubbleBorder,
            bubbleTail: bubbleTail,
            bubbleFill: bubbleFill,
            bubbleText: bubbleText,
        };
    },

    fixNewObject = function(obj) {
        var p = obj.changed._fbpath,
            new_p = p.replace(/([^\/]*\/){4}/, "/");
        obj.fbpath = new_p;
        return obj;
    },

    speechBalloon = function(nextBubble) {
        if (typeof(nextBubble) == "undefined"){ return; }

        var thisMap = getObj("page", nextBubble.page),
            token = getObj("graphic", nextBubble.token),
            player = getObj("player", nextBubble.player), 
            thisY = token.get("top"),
            thisX = token.get("left"),
            bubble = _.find(state.SpeechBalloon.shownBubbles, function(bub){ return bub.tokenId == nextBubble.token; }),
            bubbleFillTint = player.get("color") || "transparent";

        if (typeof(thisMap) == "undefined" || thisMap.get("archived")){ return; }


        var thisParagraph = nextBubble.says, 
            lineCount = 1 + (thisParagraph.match(/\n/g)||[]).length,
            approximateWidth = 286,
            approximateHeight = (lineCount * 25) + 7,  
            xAdjust = ((thisX-(thisMap.get('width') * 35)) >=0) ? -1 : 1,
            yAdjust = ((thisY-(thisMap.get('height') * 35)) >=0) ? -1 : 1,
            leftTail = thisX + (105 * xAdjust),
            topTail = thisY + (105 * yAdjust),
            leftOffsetBubble = thisX + (210 * xAdjust),
            topOffsetBubble = thisY + ((Math.floor(approximateHeight/2) + 105 < 159 ? 159 : Math.floor(approximateHeight/2) + 105) * yAdjust),
            bubbleParts = findOrCreateBubbleParts(thisMap,thisX,thisY,bubble),
            tailFlipH = (-1 !== xAdjust),
            tailFlipV = (-1 !== yAdjust),
            duration = defaultShowLength * lineCount * 1000;

        bubbleParts.bubbleBorder.set({
            layer: "map", 
            width: approximateWidth + 6,
            height: approximateHeight + 6,
            top: topOffsetBubble,
            left: leftOffsetBubble, 
            tint_color: bubbleFillTint, 
        });
        toFront(bubbleParts.bubbleBorder);

        bubbleParts.bubbleTail.set({
            layer: "map", 
            width: 140,
            height: 140,
            top: topTail,
            left: leftTail,
            fliph: tailFlipH,
            flipv: tailFlipV,
            tint_color: bubbleFillTint, 
        });
        toFront(bubbleParts.bubbleTail);

        bubbleParts.bubbleFill.set({
            layer: "map", 
            width: approximateWidth,
            height: approximateHeight,
            top: topOffsetBubble,
            left: leftOffsetBubble,
            tint_color: bubbleFillTint, 
        });
        toFront(bubbleParts.bubbleFill);

        bubbleParts.bubbleText.set({
            layer: "map", 
            text: thisParagraph,
            top: topOffsetBubble,
            left: leftOffsetBubble,
        });
        toFront(bubbleParts.bubbleText);

        // add updated bubble to shown list with new validUntil date
        if(! bubble) {
            state.SpeechBalloon.shownBubbles.push({
                borderId: bubbleParts.bubbleBorder.id,
                tailId: bubbleParts.bubbleTail.id,
                fillId: bubbleParts.bubbleFill.id,
                textId: bubbleParts.bubbleText.id,
                tokenId: nextBubble.token,
                validUntil: Date.now()+duration,
            });
        } else {
            bubble.validUntil = Date.now()+duration;
        }

        // resort list of shown bubbles so that the bubble popper will grab the oldest one first.
        state.SpeechBalloon.shownBubbles = _.sortBy(state.SpeechBalloon.shownBubbles, "validUntil");
    }, 

    wordwrap = function( str, width, brk, cut ) {
        brk = brk || '\n';
        width = width || 75;
        cut = cut || false;
        if (!str) { return str; }
        var regex = '.{1,' +width+ '}(\\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\\S+?(\\s|$)');
        return str.match( RegExp(regex, 'g') ).join( brk );
    },

    getSelectedToken = function(msg) {
        var obj, token;
        obj =  _.first(msg.selected);
        if ( typeof(obj) != "undefined" && obj._type == "graphic" && obj._id) {
            token = getObj("graphic", obj._id);
        }
        return token;
    },

    processSayMessage = function(msg, command, args) {
        var token = getSelectedToken(msg),
            origContent = args.join(' ');

        if(typeof(token) == "undefined") {
            sendChat(msg.who, origContent);
            return;             
        }

        var formattedContent;

        if(command == "!show") {
            formattedContent = origContent.replace(/::/g, "\n").replace(/~/g, " ").replace(/::/g, "\n");
        } else if( command == "!say") {
            sendChat(token.get("name") || msg.who, origContent);
            formattedContent = wordwrap(origContent, 28, "\n");         
        } else if( command == "!emote") {
            sendChat(token.get("name") || msg.who, "/em "+origContent);
            formattedContent = wordwrap("** "+origContent+" **", 28, "\n");            
        }

        // don't store objects, only store primitives
        state.SpeechBalloon.queue.push({
            token: token.get("_id"),
            page: token.get("_pageid"),
            says: formattedContent,
            player: msg.playerid,
        });
    },

    handleInput = function(msg) {

        if ( "api" !== msg.type ) {return; }

        var args, command, 
            content = msg.content;

        if(typeof(processInlineRolls) == "function") { 
            content = processInlineRolls(msg);
        }

        args = content.split(/\s+/);
        command = args.shift();

        switch(command) {
            case "!say":
            case "!show":
            case "!emote":
                processSayMessage(msg, command, args);
                return; 

            case "!cleanBubbleState":
                cleanState(msg, command, args);
                return;
        }
    },

    checkInstall = function() {
        if( ! _.has(state,'SpeechBalloon') || state.SpeechBalloon.version !== schemaVersion) {
            cleanState();
        }
        setInterval(checkBubbleDisplay, checkStepRate);
        log("SpeechBalloon v"+version+" Ready");
    },

    registerEventHandlers = function() {
        on('chat:message', handleInput);
    };


    return {
        CheckInstall: checkInstall,
        RegisterEventHandlers: registerEventHandlers
    };

}());


on("ready",function(){
    'use strict';
    SpeechBalloon.CheckInstall();
    SpeechBalloon.RegisterEventHandlers();
});
