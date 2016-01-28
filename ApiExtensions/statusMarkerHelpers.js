// helper functions for managing status markers on tokens

// list of supported status markers in order of how their icons appear
var STATUS_MARKER_IDS = [
    "red",
    "blue",
    "green",
    "brown",
    "purple",
    "pink",
    "yellow",
    "dead",
    "skull",
    "sleepy",
    "half-heart",
    "half-haze",
    "interdiction",
    "snail", 
    "lightning-helix", 
    "spanner", 
    "chained-heart", 
    "chemical-bolt", 
    "death-zone", 
    "drink-me", 
    "edge-crack", 
    "ninja-mask", 
    "stopwatch", 
    "fishing-net", 
    "overdrive", 
    "strong", 
    "fist", 
    "padlock", 
    "three-leaves", 
    "fluffy-wing", 
    "pummeled", 
    "tread", 
    "arrowed", 
    "aura", 
    "back-pain", 
    "black-flag", 
    "bleeding-eye", 
    "bolt-shield", 
    "broken-heart", 
    "cobweb", 
    "broken-shield", 
    "flying-flag", 
    "radioactive", 
    "trophy", 
    "broken-skull", 
    "frozen-orb", 
    "rolling-bomb", 
    "white-tower", 
    "grab", 
    "screaming", 
    "grenade", 
    "sentry-gun", 
    "all-for-one", 
    "angel-outfit", 
    "archery-target"
];

// get array of current status markers    
// return empty list if not a valid token
// status names with numbers will be of the format 'status@1'
function statusMarkersForToken(token) {
    if (typeof(token) != "undefined" && token._type == "graphic") {
        return token.get("statusmarkers").split(',');
    } else {
        return [];
    }
}

// check a token for a status by name
function hasStatusMarker(token, statusId) {
    if (typeof(token) != "undefined" && token._type == "graphic") {
        // could be boolean or string number
        var result = token.get("status_"+statusId);
        return result || result.length > 0;
    } else {
        return false;
    }    
}

// turns a status marker on with optional num value
function statusMarkerOn(token, statusId, num) {
    if (typeof(token) != "undefined" && token._type == "graphic") {
        if (num) {
            token.set("status_"+statusId, ""+num);
        } else {
            token.set("status_"+statusId, true);
        }
    } 
}

// turns a status marker off
function statusMarkerOff(token, statusId) {
    if (typeof(token) != "undefined" && token._type == "graphic") {
        token.set("status_"+statusId, false);
    }     
}

// flips value of status marker
function toggleMarker(token, statusId) {
    if (hasStatusMarker(token, statusId)) {
        statusMarkerOff(token, statusId);
    } else {
        statusMarkerOn(token, statusId);
    }
}
