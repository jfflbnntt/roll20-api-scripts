// By:       Jefe
// Contact:  https://app.roll20.net/users/451842/jefe
// Credits: originally created by Stephen S. https://app.roll20.net/users/135636/stephen-s
// https://app.roll20.net/forum/post/1397909/script-dungeon-buddies-inspired-speech-balloons
// I've made some improvements including color coding the bubbles based on the player colors and support for multiple bubbles at once
var SpeechBalloon = SpeechBalloon || (function(){
    'use strict';

    var version = 0.3,
        schemaVersion = 0.6,
		defaultShowLength = 8, // seconds
		msPerSec = 1000, // for conversions.. no magic numbers!
		checkStepRate = 1000, //ms  = 1 second
        hiddenState = {
	        layer: "gmlayer", 
	        width: 35,
	        height: 35,
	        left: 35,
	        top: 35
		},

    bustBalloon = function(bubble) {
        if (typeof(bubble) != "undefined") {
            getObj("graphic" , bubble.borderId).remove();
            getObj("graphic" , bubble.tailId).remove();
            getObj("graphic" , bubble.fillId).remove();
            getObj("text" , bubble.textId).remove();
        }
	},

	clearBubbles = function() {
		// var allBubbleParts = findObjs({ isBubblePart: true }).map(function(bubblePart){
		// 	return {type: bubblePart.type, id: bubblePart.id};
		// }); 
		// log("allBubbleParts "+allBubbleParts.length);
		// _.each(allBubbleParts, function(bubblePart) {
		// 	getObj(bubblePart.type, bubblePart.id).remove();
		// });
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

    showNewBalloons = function() {
        if( state.SpeechBalloon.queue.length > 0 ) {
            var nextBubble = state.SpeechBalloon.queue.shift();
            if (! nextBubble.page.get("archived") ) {
                speechBalloon(nextBubble);
            }
        }
	},

    removeOldBalloons = function() {
		if(state.SpeechBalloon.shownBubbles.length > 0 && state.SpeechBalloon.shownBubbles[0].validUntil < Date.now()) {
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
					isBubblePart: true,
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
        var theseWords = nextBubble.says, whoSaid = nextBubble.token.get("name"), 
            thisMap = nextBubble.page, thisY = nextBubble.token.get("top"),
            thisX = nextBubble.token.get("left"),
            bubbleFillTint = nextBubble.player.get("color") || "transparent";

        if (theseWords.indexOf("--show|") != 0) {
            sendChat(whoSaid, theseWords);
            theseWords = wordwrap(theseWords, 28, "\n");
        } else {
            theseWords = theseWords.replace("--show|", "");
            theseWords = theseWords.replace(/~/g, " ");
            theseWords = theseWords.replace(/::/g, "\n");
        }

		var thisParagraph = theseWords, 
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
			tailFlipV = (-1 !== yAdjust);

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
			validUntil: Date.now()+(nextBubble.duration*msPerSec),
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

	checkSelect = function(obj,type,command) {
		if (obj === undefined || obj.length < 1) {
			return false;
		}
		if (obj._type !== type) {
			return false;
		}
		return true;
	},

	handleInput = function(msg) {

		if ( "api" !== msg.type ) {return; }


		var args = msg.content.split(' '),
			obj =  _.first(msg.selected),
			playerid = msg.playerid,
			player = getObj("player", playerid),
			token,
			thisY,
			thisX;

		switch(args.shift()) {
			case "!say":
				if ( ! checkSelect(obj,"graphic") ) {
					//at least show the message if they forgot to select a token
					sendChat(msg.who, args.join(' '));
					return;
				}
				state.SpeechBalloon.queue.push({
                    token: getObj("graphic", obj._id),
                    page: getObj('page',getObj("graphic", obj._id).get('pageid')),
                    says: args.join(' '),
                    duration: defaultShowLength,
                    player: player,
				});

			return; 

            case "!clearBubbles":
            	clearBubbles();
            	cleanState();

			return;
		}
	},

	checkInstall = function() {
		if( ! _.has(state,'SpeechBalloon') || state.SpeechBalloon.version !== schemaVersion) {
            log('SpeechBalloon: Resetting state');
			cleanState();
		}
		setInterval(showNewBalloons, checkStepRate);
		setInterval(removeOldBalloons, checkStepRate);
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