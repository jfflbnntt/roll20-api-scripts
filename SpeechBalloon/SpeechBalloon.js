// By:       Jefe
// Contact:  https://app.roll20.net/users/451842/jefe
// Credits: originally created by Stephen S. https://app.roll20.net/users/135636/stephen-s
// https://app.roll20.net/forum/post/1397909/script-dungeon-buddies-inspired-speech-balloons
var SpeechBalloon = SpeechBalloon || (function(){
    'use strict';

    var version = 0.2,
        schemaVersion = 0.5,
		defaultShowLength = 4, // seconds
		checkStepRate = 500, //ms  = 1 second

    bustBalloon = function(bubble) {
        if (typeof(bubble) != "undefined") {
            getObj("graphic" , bubble.borderId).remove();
            getObj("graphic" , bubble.tailId).remove();
            getObj("graphic" , bubble.fillId).remove();
            getObj("text" , bubble.textId).remove();
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

	createBubbleParts = function(thisMap,thisX,thisY) {
		var bubbleBorder, bubbleTail, bubbleFill, bubbleText,
			creationDefaults = {
					_pageid: thisMap.id,
					top: thisY,
					left: thisX,
					width: 70,
					height: 70,
					layer: "gmlayer",
				};

		bubbleBorder = fixNewObject(createObj("graphic", _.defaults({
			imgsrc: "https://s3.amazonaws.com/files.d20.io/images/6565520/qJVbhBJQAw7FNDzBubKuNg/thumb.png?1417619659"
		},creationDefaults)));

		bubbleTail = fixNewObject(createObj("graphic", _.defaults({
			width: 140,
			height: 140,
			imgsrc: "https://s3.amazonaws.com/files.d20.io/images/6565493/BMPVhSPmlFaY_KyB7K8XHQ/thumb.png?1417619533"
		},creationDefaults)));

		bubbleFill = fixNewObject(createObj("graphic", _.defaults({
			imgsrc: "https://s3.amazonaws.com/files.d20.io/images/6565524/yTHHF5NwFJcd0ddZ-9nyxg/thumb.png?1417619728"
		},creationDefaults)));

		bubbleText = fixNewObject(createObj("text", _.defaults({
			text: "DoubleBubbleBumBubblesDouble",
			font_size: 16,
			color: "rgb(0,0,0)",
			font_family: "Courier"
		},creationDefaults)));

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
			bubbleParts = createBubbleParts(thisMap,thisX,thisY),
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

		state.SpeechBalloon.shownBubbles.push({
			borderId: bubbleParts.bubbleBorder.id,
			tailId: bubbleParts.bubbleTail.id,
			fillId: bubbleParts.bubbleFill.id,
			textId: bubbleParts.bubbleText.id,
			validUntil: Date.now()+duration,
		});
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
        } else {
            sendChat(token.get("name") || msg.who, origContent);
            formattedContent = wordwrap(origContent, 28, "\n");        	
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

		var args, command, content;
		if(typeof(processInlineRolls) == "function") { 
			content = processInlineRolls(msg);
		} else { 
			content = msg.content;
		};
        args = content.split(/\s+/);
        command = args.shift();

		switch(command) {
			case "!say":
			case "!show":
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