//originally created by Stephen S. https://app.roll20.net/users/135636/stephen-s
//https://app.roll20.net/forum/post/1397909/script-dungeon-buddies-inspired-speech-balloons
var SpeechBalloon = SpeechBalloon || (function(){
    'use strict';

    var version = 0.1,
        schemaVersion = 0.5,
		defaultShowLength = 8, // seconds
		msPerSec = 1000, // for conversions.. no magic numbers!
		checkStepRate = 1000, //ms  = 1 second
		checkInterval = false,


    bustBalloon = function(pageObject) {
        if(state.SpeechBalloon.bubbleShown) {
            if (typeof(pageObject) != "undefined") {
                var page = pageObject.get("_id"),
                    bubbleBorder = state.SpeechBalloon.pageGraphicMap[page].BorderId,
                    bubbleTail = state.SpeechBalloon.pageGraphicMap[page].TailId,
                    bubbleFill = state.SpeechBalloon.pageGraphicMap[page].FillId,
                    bubbleText = state.SpeechBalloon.pageGraphicMap[page].TextId,
                    hiddenState={
                            layer: "gmlayer", 
                            width: 35,
                            height: 35,
                            left: 35,
                            top: 35
                    };
                getObj("graphic" , bubbleBorder).set( hiddenState );
                getObj("graphic" , bubbleTail).set( hiddenState );
                getObj("graphic" , bubbleFill).set( hiddenState );
                getObj("text" , bubbleText).set( hiddenState );
                state.SpeechBalloon.bubbleShown=false;
            }
        }
	},

	cleanState = function() {
		log('SpeechBalloon: Resetting state');
		/* Default Settings stored in the state. */
		state.SpeechBalloon = {
			version: schemaVersion,
			pageGraphicMap: {},
			queue: [],
			validUntil: 0,
			bubbleShown: false
		};
	},

    checkBubbleDisplay = function() {
		var nextBubble, newLastBubble, page, lastPage, token;
        if(state.SpeechBalloon.validUntil < Date.now() ) {
            if( state.SpeechBalloon.queue.length  == 0 ) {
                if ( state.lastBalloon != false ) {
                    bustBalloon(state.lastBalloon.page);
                    state.lastBalloon = false;
                }
            } else {
                nextBubble=_.first(state.SpeechBalloon.queue);
                newLastBubble = nextBubble;
                state.SpeechBalloon.queue=_.rest(state.SpeechBalloon.queue);
                page = nextBubble.page;
                if ( state.lastBalloon != false ) {
                    lastPage = state.lastBalloon.page;
                    if ( page.id != lastPage.id ) {
                        bustBalloon(state.lastBalloon.page);
                    }
                } else {
                    lastPage = false;
                }
                if (! page.get("archived") ) {
                    speechBalloon(nextBubble);
                    state.SpeechBalloon.validUntil = Date.now()+(nextBubble.duration*msPerSec);
                    state.lastBalloon = newLastBubble;
                    state.SpeechBalloon.bubbleShown = true;
                }
            }
        }
	},


	findOrCreateBubbleParts = function(thisMap,thisX,thisY) {
		var bubbleBorder, bubbleTail,bubbleFill,bubbleText,
			creationDefaults = {
					_pageid: thisMap.id,
					top: thisY,
					left: thisX,
					width: 70,
					height: 70,
					layer: "gmlayer"
				};
		if( _.has(state.SpeechBalloon.pageGraphicMap, thisMap.id) ) {
			bubbleBorder = getObj("graphic" , state.SpeechBalloon.pageGraphicMap[thisMap.id].BorderId);
			bubbleTail   = getObj("graphic" , state.SpeechBalloon.pageGraphicMap[thisMap.id].TailId);
			bubbleFill   = getObj("graphic" , state.SpeechBalloon.pageGraphicMap[thisMap.id].FillId);
			bubbleText   = getObj("text"    , state.SpeechBalloon.pageGraphicMap[thisMap.id].TextId); 
		}

		if ( ! bubbleBorder)  {
			bubbleBorder = fixNewObject(createObj("graphic", _.defaults({
				imgsrc: "https://s3.amazonaws.com/files.d20.io/images/6565520/qJVbhBJQAw7FNDzBubKuNg/thumb.png?1417619659"
			},creationDefaults)));
            toFront(bubbleBorder);
		}
		if ( ! bubbleTail)  {
			bubbleTail = fixNewObject(createObj("graphic", _.defaults({
				width: 140,
				height: 140,
				imgsrc: "https://s3.amazonaws.com/files.d20.io/images/6565493/BMPVhSPmlFaY_KyB7K8XHQ/thumb.png?1417619533"
			},creationDefaults)));
            toFront(bubbleTail);
		}
		if ( ! bubbleFill)  {
			bubbleFill = fixNewObject(createObj("graphic", _.defaults({
				imgsrc: "https://s3.amazonaws.com/files.d20.io/images/6565524/yTHHF5NwFJcd0ddZ-9nyxg/thumb.png?1417619728"
			},creationDefaults)));
            toFront(bubbleFill);
		}
		if ( ! bubbleText)  {
			bubbleText = fixNewObject(createObj("text", _.defaults({
				text: "DoubleBubbleBumBubblesDouble",
				font_size: 16,
				color: "rgb(0,0,0)",
				font_family: "Courier"
			},creationDefaults)));
            toFront(bubbleText);
		}

		state.SpeechBalloon.pageGraphicMap[thisMap.id]={
			BorderId: bubbleBorder.id,
			TailId: bubbleTail.id,
			FillId: bubbleFill.id,
			TextId: bubbleText.id
		};

		return {
			bubbleTail: bubbleTail,
			bubbleFill: bubbleFill,
			bubbleBorder: bubbleBorder,
			bubbleText: bubbleText
		};
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
			bubbleParts = findOrCreateBubbleParts(thisMap,thisX,thisY),
			tailFlipH = (-1 !== xAdjust),
			tailFlipV = (-1 !== yAdjust);

		if (bubbleParts.bubbleBorder)  {
            bubbleParts.bubbleBorder.set({
				layer: "map", 
				width: approximateWidth + 6,
				height: approximateHeight + 6,
				top: topOffsetBubble,
				left: leftOffsetBubble, 
			});
            toFront(bubbleParts.bubbleBorder);
		}
        if (bubbleParts.bubbleTail)  {
            bubbleParts.bubbleTail.set({
                layer: "map", 
				width: 140,
				height: 140,
				top: topTail,
				left: leftTail,
				fliph: tailFlipH,
				flipv: tailFlipV,
			});
            toFront(bubbleParts.bubbleTail);
		}
        if (bubbleParts.bubbleFill)  {
            bubbleParts.bubbleFill.set({
				layer: "map", 
				width: approximateWidth,
				height: approximateHeight,
				top: topOffsetBubble,
				left: leftOffsetBubble,
				tint_color: bubbleFillTint, 
			});
            toFront(bubbleParts.bubbleFill);
		}
        if (bubbleParts.bubbleText)  {
            bubbleParts.bubbleText.set({
				layer: "map", 
				text: thisParagraph,
				top: topOffsetBubble,
				left: leftOffsetBubble,
			});
            toFront(bubbleParts.bubbleText);
		}
		state.SpeechBalloon.bubbleShown=true;
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
			case "!makeBubble": 
				if ( ! checkSelect(obj,"graphic") ) {return; }
				state.SpeechBalloon.queue.push({
                    token: getObj("graphic", obj._id),
                    page: getObj('page',getObj("graphic", obj._id).get('pageid')),
                    says: args.join(' '),
                    duration: defaultShowLength,
                    player: player,
				});

			return; 

			case "!bustBubble":
                if ( ! checkSelect(obj,"graphic") ) {return; }
                bustBalloon(getObj('page',getObj("graphic", obj._id).get('pageid')));

        	return;

            case "!cleanBubble":
            	cleanState();

			return;
		}
	},


	checkInstall = function() {
		if( ! _.has(state,'SpeechBalloon') || state.SpeechBalloon.version !== schemaVersion) {
			cleanState();
		}

        if( ! _.has(state,'lastBalloon')) {
            log('SpeechBalloon.lastBalloon: Resetting state');
			/* Default Settings stored in the state. */
			state.lastBalloon = false;
		}


		checkInterval = setInterval(checkBubbleDisplay,checkStepRate);
	},
    
    
    fixNewObject = function(obj) {
		var p = obj.changed._fbpath,
			new_p = p.replace(/([^\/]*\/){4}/, "/");
		obj.fbpath = new_p;
		return obj;
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