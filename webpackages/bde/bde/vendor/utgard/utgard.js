(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.utgard = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){

; Util = global.Util = require(2);
; var __browserify_shim_require__=require;(function browserifyShim(module, exports, require, define, browserify_shim__define__module__export__) {
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// From: http://hg.mozilla.org/mozilla-central/raw-file/ec10630b1a54/js/src/devtools/jint/sunspider/string-base64.js

/*jslint white: false, bitwise: false, plusplus: false */
/*global console */

var Base64 = {

/* Convert data (an array of integers) to a Base64 string. */
toBase64Table : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split(''),
base64Pad     : '=',

encode: function (data) {
    "use strict";
    var result = '';
    var toBase64Table = Base64.toBase64Table;
    var base64Pad = Base64.base64Pad;
    var length = data.length;
    var i;
    // Convert every three bytes to 4 ascii characters.
  /* BEGIN LOOP */
    for (i = 0; i < (length - 2); i += 3) {
        result += toBase64Table[data[i] >> 2];
        result += toBase64Table[((data[i] & 0x03) << 4) + (data[i+1] >> 4)];
        result += toBase64Table[((data[i+1] & 0x0f) << 2) + (data[i+2] >> 6)];
        result += toBase64Table[data[i+2] & 0x3f];
    }
  /* END LOOP */

    // Convert the remaining 1 or 2 bytes, pad out to 4 characters.
    if (length%3) {
        i = length - (length%3);
        result += toBase64Table[data[i] >> 2];
        if ((length%3) === 2) {
            result += toBase64Table[((data[i] & 0x03) << 4) + (data[i+1] >> 4)];
            result += toBase64Table[(data[i+1] & 0x0f) << 2];
            result += base64Pad;
        } else {
            result += toBase64Table[(data[i] & 0x03) << 4];
            result += base64Pad + base64Pad;
        }
    }

    return result;
},

/* Convert Base64 data to a string */
toBinaryTable : [
    -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1,
    -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1,
    -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,62, -1,-1,-1,63,
    52,53,54,55, 56,57,58,59, 60,61,-1,-1, -1, 0,-1,-1,
    -1, 0, 1, 2,  3, 4, 5, 6,  7, 8, 9,10, 11,12,13,14,
    15,16,17,18, 19,20,21,22, 23,24,25,-1, -1,-1,-1,-1,
    -1,26,27,28, 29,30,31,32, 33,34,35,36, 37,38,39,40,
    41,42,43,44, 45,46,47,48, 49,50,51,-1, -1,-1,-1,-1
],

decode: function (data, offset) {
    "use strict";
    offset = typeof(offset) !== 'undefined' ? offset : 0;
    var toBinaryTable = Base64.toBinaryTable;
    var base64Pad = Base64.base64Pad;
    var result, result_length, idx, i, c, padding;
    var leftbits = 0; // number of bits decoded, but yet to be appended
    var leftdata = 0; // bits decoded, but yet to be appended
    var data_length = data.indexOf('=') - offset;

    if (data_length < 0) { data_length = data.length - offset; }

    /* Every four characters is 3 resulting numbers */
    result_length = (data_length >> 2) * 3 + Math.floor((data_length%4)/1.5);
    result = new Array(result_length);

    // Convert one by one.
  /* BEGIN LOOP */
    for (idx = 0, i = offset; i < data.length; i++) {
        c = toBinaryTable[data.charCodeAt(i) & 0x7f];
        padding = (data.charAt(i) === base64Pad);
        // Skip illegal characters and whitespace
        if (c === -1) {
            console.error("Illegal character code " + data.charCodeAt(i) + " at position " + i);
            continue;
        }
        
        // Collect data into leftdata, update bitcount
        leftdata = (leftdata << 6) | c;
        leftbits += 6;

        // If we have 8 or more bits, append 8 bits to the result
        if (leftbits >= 8) {
            leftbits -= 8;
            // Append if not padding.
            if (!padding) {
                result[idx++] = (leftdata >> leftbits) & 0xff;
            }
            leftdata &= (1 << leftbits) - 1;
        }
    }
  /* END LOOP */

    // If there are any bits left, the base64 string was corrupted
    if (leftbits) {
        throw {name: 'Base64-Error', 
               message: 'Corrupted base64 string'};
    }

    return result;
}

}; /* End of Base64 namespace */

; browserify_shim__define__module__export__(typeof Base64 != "undefined" ? Base64 : window.Base64);

}).call(global, undefined, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"2":2}],2:[function(require,module,exports){
(function (global){
; var __browserify_shim_require__=require;(function browserifyShim(module, exports, require, define, browserify_shim__define__module__export__) {
/*
 * from noVNC: HTML5 VNC client
 * Copyright (C) 2012 Joel Martin
 * Licensed under MPL 2.0 (see LICENSE.txt)
 *
 * See README.md for usage and integration instructions.
 */

"use strict";
/*jslint bitwise: false, white: false */
/*global window, console, document, navigator, ActiveXObject */

// Globals defined here
var Util = {};


/*
 * Make arrays quack
 */

Array.prototype.push8 = function (num) {
    this.push(num & 0xFF);
};

Array.prototype.push16 = function (num) {
    this.push((num >> 8) & 0xFF,
              (num     ) & 0xFF  );
};
Array.prototype.push32 = function (num) {
    this.push((num >> 24) & 0xFF,
              (num >> 16) & 0xFF,
              (num >>  8) & 0xFF,
              (num      ) & 0xFF  );
};

// IE does not support map (even in IE9)
//This prototype is provided by the Mozilla foundation and
//is distributed under the MIT license.
//http://www.ibiblio.org/pub/Linux/LICENSES/mit.license
if (!Array.prototype.map)
{
  Array.prototype.map = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var res = new Array(len);
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
        res[i] = fun.call(thisp, this[i], i, this);
    }

    return res;
  };
}

// 
// requestAnimationFrame shim with setTimeout fallback
//

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function(callback){
                window.setTimeout(callback, 1000 / 60);
            };
})();

/* 
 * ------------------------------------------------------
 * Namespaced in Util
 * ------------------------------------------------------
 */

/*
 * Logging/debug routines
 */

Util._log_level = 'warn';
Util.init_logging = function (level) {
    if (typeof level === 'undefined') {
        level = Util._log_level;
    } else {
        Util._log_level = level;
    }
    if (typeof window.console === "undefined") {
        if (typeof window.opera !== "undefined") {
            window.console = {
                'log'  : window.opera.postError,
                'warn' : window.opera.postError,
                'error': window.opera.postError };
        } else {
            window.console = {
                'log'  : function(m) {},
                'warn' : function(m) {},
                'error': function(m) {}};
        }
    }

    Util.Debug = Util.Info = Util.Warn = Util.Error = function (msg) {};
    switch (level) {
        case 'debug': Util.Debug = function (msg) { console.log(msg); };
        case 'info':  Util.Info  = function (msg) { console.log(msg); };
        case 'warn':  Util.Warn  = function (msg) { console.warn(msg); };
        case 'error': Util.Error = function (msg) { console.error(msg); };
        case 'none':
            break;
        default:
            throw("invalid logging type '" + level + "'");
    }
};
Util.get_logging = function () {
    return Util._log_level;
};
// Initialize logging level
Util.init_logging();


// Set configuration default for Crockford style function namespaces
Util.conf_default = function(cfg, api, defaults, v, mode, type, defval, desc) {
    var getter, setter;

    // Default getter function
    getter = function (idx) {
        if ((type in {'arr':1, 'array':1}) &&
            (typeof idx !== 'undefined')) {
            return cfg[v][idx];
        } else {
            return cfg[v];
        }
    };

    // Default setter function
    setter = function (val, idx) {
        if (type in {'boolean':1, 'bool':1}) {
            if ((!val) || (val in {'0':1, 'no':1, 'false':1})) {
                val = false;
            } else {
                val = true;
            }
        } else if (type in {'integer':1, 'int':1}) {
            val = parseInt(val, 10);
        } else if (type === 'str') {
            val = String(val);
        } else if (type === 'func') {
            if (!val) {
                val = function () {};
            }
        }
        if (typeof idx !== 'undefined') {
            cfg[v][idx] = val;
        } else {
            cfg[v] = val;
        }
    };

    // Set the description
    api[v + '_description'] = desc;

    // Set the getter function
    if (typeof api['get_' + v] === 'undefined') {
        api['get_' + v] = getter;
    }

    // Set the setter function with extra sanity checks
    if (typeof api['set_' + v] === 'undefined') {
        api['set_' + v] = function (val, idx) {
            if (mode in {'RO':1, 'ro':1}) {
                throw(v + " is read-only");
            } else if ((mode in {'WO':1, 'wo':1}) &&
                       (typeof cfg[v] !== 'undefined')) {
                throw(v + " can only be set once");
            }
            setter(val, idx);
        };
    }

    // Set the default value
    if (typeof defaults[v] !== 'undefined') {
        defval = defaults[v];
    } else if ((type in {'arr':1, 'array':1}) &&
            (! (defval instanceof Array))) {
        defval = [];
    }
    // Coerce existing setting to the right type
    //Util.Debug("v: " + v + ", defval: " + defval + ", defaults[v]: " + defaults[v]);
    setter(defval);
};

// Set group of configuration defaults
Util.conf_defaults = function(cfg, api, defaults, arr) {
    var i;
    for (i = 0; i < arr.length; i++) {
        Util.conf_default(cfg, api, defaults, arr[i][0], arr[i][1],
                arr[i][2], arr[i][3], arr[i][4]);
    }
};


/*
 * Cross-browser routines
 */


// Dynamically load scripts without using document.write()
// Reference: http://unixpapa.com/js/dyna.html
//
// Handles the case where load_scripts is invoked from a script that
// itself is loaded via load_scripts. Once all scripts are loaded the
// window.onscriptsloaded handler is called (if set).
Util.get_include_uri = function() {
    return (typeof INCLUDE_URI !== "undefined") ? INCLUDE_URI : "include/";
}
Util._loading_scripts = [];
Util._pending_scripts = [];
Util.load_scripts = function(files) {
    var head = document.getElementsByTagName('head')[0], script,
        ls = Util._loading_scripts, ps = Util._pending_scripts;
    for (var f=0; f<files.length; f++) {
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = Util.get_include_uri() + files[f];
        //console.log("loading script: " + script.src);
        script.onload = script.onreadystatechange = function (e) {
            while (ls.length > 0 && (ls[0].readyState === 'loaded' ||
                                     ls[0].readyState === 'complete')) {
                // For IE, append the script to trigger execution
                var s = ls.shift();
                //console.log("loaded script: " + s.src);
                head.appendChild(s);
            }
            if (!this.readyState ||
                (Util.Engine.presto && this.readyState === 'loaded') ||
                this.readyState === 'complete') {
                if (ps.indexOf(this) >= 0) {
                    this.onload = this.onreadystatechange = null;
                    //console.log("completed script: " + this.src);
                    ps.splice(ps.indexOf(this), 1);

                    // Call window.onscriptsload after last script loads
                    if (ps.length === 0 && window.onscriptsload) {
                        window.onscriptsload();
                    }
                }
            }
        };
        // In-order script execution tricks
        if (Util.Engine.trident) {
            // For IE wait until readyState is 'loaded' before
            // appending it which will trigger execution
            // http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
            ls.push(script);
        } else {
            // For webkit and firefox set async=false and append now
            // https://developer.mozilla.org/en-US/docs/HTML/Element/script
            script.async = false;
            head.appendChild(script);
        }
        ps.push(script);
    }
}

// Get DOM element position on page
Util.getPosition = function (obj) {
    var x = 0, y = 0;
    if (obj.offsetParent) {
        do {
            x += obj.offsetLeft;
            y += obj.offsetTop;
            obj = obj.offsetParent;
        } while (obj);
    }
    return {'x': x, 'y': y};
};

// Get mouse event position in DOM element
Util.getEventPosition = function (e, obj, scale) {
    var evt, docX, docY, pos;
    //if (!e) evt = window.event;
    evt = (e ? e : window.event);
    evt = (evt.changedTouches ? evt.changedTouches[0] : evt.touches ? evt.touches[0] : evt);
    if (evt.pageX || evt.pageY) {
        docX = evt.pageX;
        docY = evt.pageY;
    } else if (evt.clientX || evt.clientY) {
        docX = evt.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
        docY = evt.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
    }
    pos = Util.getPosition(obj);
    if (typeof scale === "undefined") {
        scale = 1;
    }
    return {'x': (docX - pos.x) / scale, 'y': (docY - pos.y) / scale};
};


// Event registration. Based on: http://www.scottandrew.com/weblog/articles/cbs-events
Util.addEvent = function (obj, evType, fn){
    if (obj.attachEvent){
        var r = obj.attachEvent("on"+evType, fn);
        return r;
    } else if (obj.addEventListener){
        obj.addEventListener(evType, fn, false); 
        return true;
    } else {
        throw("Handler could not be attached");
    }
};

Util.removeEvent = function(obj, evType, fn){
    if (obj.detachEvent){
        var r = obj.detachEvent("on"+evType, fn);
        return r;
    } else if (obj.removeEventListener){
        obj.removeEventListener(evType, fn, false);
        return true;
    } else {
        throw("Handler could not be removed");
    }
};

Util.stopEvent = function(e) {
    if (e.stopPropagation) { e.stopPropagation(); }
    else                   { e.cancelBubble = true; }

    if (e.preventDefault)  { e.preventDefault(); }
    else                   { e.returnValue = false; }
};


// Set browser engine versions. Based on mootools.
Util.Features = {xpath: !!(document.evaluate), air: !!(window.runtime), query: !!(document.querySelector)};

Util.Engine = {
    // Version detection break in Opera 11.60 (errors on arguments.callee.caller reference)
    //'presto': (function() {
    //         return (!window.opera) ? false : ((arguments.callee.caller) ? 960 : ((document.getElementsByClassName) ? 950 : 925)); }()),
    'presto': (function() { return (!window.opera) ? false : true; }()),

    'trident': (function() {
            return (!window.ActiveXObject) ? false : ((window.XMLHttpRequest) ? ((document.querySelectorAll) ? 6 : 5) : 4); }()),
    'webkit': (function() {
            try { return (navigator.taintEnabled) ? false : ((Util.Features.xpath) ? ((Util.Features.query) ? 525 : 420) : 419); } catch (e) { return false; } }()),
    //'webkit': (function() {
    //        return ((typeof navigator.taintEnabled !== "unknown") && navigator.taintEnabled) ? false : ((Util.Features.xpath) ? ((Util.Features.query) ? 525 : 420) : 419); }()),
    'gecko': (function() {
            return (!document.getBoxObjectFor && window.mozInnerScreenX == null) ? false : ((document.getElementsByClassName) ? 19 : 18); }())
};
if (Util.Engine.webkit) {
    // Extract actual webkit version if available
    Util.Engine.webkit = (function(v) {
            var re = new RegExp('WebKit/([0-9\.]*) ');
            v = (navigator.userAgent.match(re) || ['', v])[1];
            return parseFloat(v, 10);
        })(Util.Engine.webkit);
}

Util.Flash = (function(){
    var v, version;
    try {
        v = navigator.plugins['Shockwave Flash'].description;
    } catch(err1) {
        try {
            v = new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
        } catch(err2) {
            v = '0 r0';
        }
    }
    version = v.match(/\d+/g);
    return {version: parseInt(version[0] || 0 + '.' + version[1], 10) || 0, build: parseInt(version[2], 10) || 0};
}()); 

; browserify_shim__define__module__export__(typeof Util != "undefined" ? Util : window.Util);

}).call(global, undefined, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
(function (global){

; Util = global.Util = require(2);
Base64 = global.Base64 = require(1);
; var __browserify_shim_require__=require;(function browserifyShim(module, exports, require, define, browserify_shim__define__module__export__) {
/*
 * Websock: high-performance binary WebSockets
 * Copyright (C) 2012 Joel Martin
 * Licensed under MPL 2.0 (see LICENSE.txt)
 *
 * Websock is similar to the standard WebSocket object but Websock
 * enables communication with raw TCP sockets (i.e. the binary stream)
 * via websockify. This is accomplished by base64 encoding the data
 * stream between Websock and websockify.
 *
 * Websock has built-in receive queue buffering; the message event
 * does not contain actual data but is simply a notification that
 * there is new data available. Several rQ* methods are available to
 * read binary data off of the receive queue.
 */

/*jslint browser: true, bitwise: false, plusplus: false */
/*global Util, Base64 */


// Load Flash WebSocket emulator if needed

// To force WebSocket emulator even when native WebSocket available
//window.WEB_SOCKET_FORCE_FLASH = true;
// To enable WebSocket emulator debug:
//window.WEB_SOCKET_DEBUG=1;
/*
if (window.WebSocket && !window.WEB_SOCKET_FORCE_FLASH) {
    Websock_native = true;
} else if (window.MozWebSocket && !window.WEB_SOCKET_FORCE_FLASH) {
    Websock_native = true;
    window.WebSocket = window.MozWebSocket;
} else {
    /* no builtin WebSocket so load web_socket.js */
    /*
    Websock_native = false;
    (function () {
        window.WEB_SOCKET_SWF_LOCATION = Util.get_include_uri() +
                    "web-socket-js/WebSocketMain.swf";
        if (Util.Engine.trident) {
            Util.Debug("Forcing uncached load of WebSocketMain.swf");
            window.WEB_SOCKET_SWF_LOCATION += "?" + Math.random();
        }
        Util.load_scripts(["web-socket-js/swfobject.js",
                           "web-socket-js/web_socket.js"]);
    }());

}
*/

function Websock() {
"use strict";

var api = {},         // Public API
    websocket = null, // WebSocket object
    mode = 'base64',  // Current WebSocket mode: 'binary', 'base64'
    rQ = [],          // Receive queue
    rQi = 0,          // Receive queue index
    rQmax = 10000,    // Max receive queue size before compacting
    sQ = [],          // Send queue

    eventHandlers = {
        'message' : function() {},
        'open'    : function() {},
        'close'   : function() {},
        'error'   : function() {}
    },

    test_mode = false;


//
// Queue public functions
//

function get_sQ() {
    return sQ;
}

function get_rQ() {
    return rQ;
}
function get_rQi() {
    return rQi;
}
function set_rQi(val) {
    rQi = val;
}

function rQlen() {
    return rQ.length - rQi;
}

function rQpeek8() {
    return (rQ[rQi]      );
}
function rQshift8() {
    return (rQ[rQi++]      );
}
function rQunshift8(num) {
    if (rQi === 0) {
        rQ.unshift(num);
    } else {
        rQi -= 1;
        rQ[rQi] = num;
    }

}
function rQshift16() {
    return (rQ[rQi++] <<  8) +
           (rQ[rQi++]      );
}
function rQshift32() {
    return (rQ[rQi++] << 24) +
           (rQ[rQi++] << 16) +
           (rQ[rQi++] <<  8) +
           (rQ[rQi++]      );
}
function rQshiftStr(len) {
    if (typeof(len) === 'undefined') { len = rQlen(); }
    var arr = rQ.slice(rQi, rQi + len);
    rQi += len;
    return String.fromCharCode.apply(null, arr);
}
function rQshiftBytes(len) {
    if (typeof(len) === 'undefined') { len = rQlen(); }
    rQi += len;
    return rQ.slice(rQi-len, rQi);
}

function rQslice(start, end) {
    if (end) {
        return rQ.slice(rQi + start, rQi + end);
    } else {
        return rQ.slice(rQi + start);
    }
}

// Check to see if we must wait for 'num' bytes (default to FBU.bytes)
// to be available in the receive queue. Return true if we need to
// wait (and possibly print a debug message), otherwise false.
function rQwait(msg, num, goback) {
    var rQlen = rQ.length - rQi; // Skip rQlen() function call
    if (rQlen < num) {
        if (goback) {
            if (rQi < goback) {
                throw("rQwait cannot backup " + goback + " bytes");
            }
            rQi -= goback;
        }
        //Util.Debug("   waiting for " + (num-rQlen) +
        //           " " + msg + " byte(s)");
        return true;  // true means need more data
    }
    return false;
}

//
// Private utility routines
//

function encode_message() {
    if (mode === 'binary') {
        // Put in a binary arraybuffer
        return (new Uint8Array(sQ)).buffer;
    } else {
        // base64 encode
        return Base64.encode(sQ);
    }
}

function decode_message(data) {
    //Util.Debug(">> decode_message: " + data);
    if (mode === 'binary') {
        // push arraybuffer values onto the end
        var u8 = new Uint8Array(data);
        for (var i = 0; i < u8.length; i++) {
            rQ.push(u8[i]);
        }
    } else {
        // base64 decode and concat to the end
        rQ = rQ.concat(Base64.decode(data, 0));
    }
    //Util.Debug(">> decode_message, rQ: " + rQ);
}


//
// Public Send functions
//

function flush() {
    if (websocket.bufferedAmount !== 0) {
        Util.Debug("bufferedAmount: " + websocket.bufferedAmount);
    }
    if (websocket.bufferedAmount < api.maxBufferedAmount) {
        //Util.Debug("arr: " + arr);
        //Util.Debug("sQ: " + sQ);
        if (sQ.length > 0) {
            websocket.send(encode_message(sQ));
            sQ = [];
        }
        return true;
    } else {
        Util.Info("Delaying send, bufferedAmount: " +
                websocket.bufferedAmount);
        return false;
    }
}

// overridable for testing
function send(arr) {
    //Util.Debug(">> send_array: " + arr);
    sQ = sQ.concat(arr);
    return flush();
}

function send_string(str) {
    //Util.Debug(">> send_string: " + str);
    api.send(str.split('').map(
        function (chr) { return chr.charCodeAt(0); } ) );
}

//
// Other public functions

function recv_message(e) {
    //Util.Debug(">> recv_message: " + e.data.length);

    try {
        decode_message(e.data);
        if (rQlen() > 0) {
            eventHandlers.message();
            // Compact the receive queue
            if (rQ.length > rQmax) {
                //Util.Debug("Compacting receive queue");
                rQ = rQ.slice(rQi);
                rQi = 0;
            }
        } else {
            Util.Debug("Ignoring empty message");
        }
    } catch (exc) {
        if (typeof exc.stack !== 'undefined') {
            Util.Warn("recv_message, caught exception: " + exc.stack);
        } else if (typeof exc.description !== 'undefined') {
            Util.Warn("recv_message, caught exception: " + exc.description);
        } else {
            Util.Warn("recv_message, caught exception:" + exc);
        }
        if (typeof exc.name !== 'undefined') {
            eventHandlers.error(exc.name + ": " + exc.message);
        } else {
            eventHandlers.error(exc);
        }
    }
    //Util.Debug("<< recv_message");
}


// Set event handlers
function on(evt, handler) { 
    eventHandlers[evt] = handler;
}

function init(protocols, ws_schema) {
    rQ         = [];
    rQi        = 0;
    sQ         = [];
    websocket  = null;

    var bt = false,
        wsbt = false,
        try_binary = false;

    // Check for full typed array support
    if (('Uint8Array' in window) &&
        ('set' in Uint8Array.prototype)) {
        bt = true;
    }
    // Check for full binary type support in WebSocket
    // Inspired by:
    // https://github.com/Modernizr/Modernizr/issues/370
    // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/websockets/binary.js
    try {
        if (bt && ('binaryType' in WebSocket.prototype ||
                   !!(new WebSocket(ws_schema + '://.').binaryType))) {
            Util.Info("Detected binaryType support in WebSockets");
            wsbt = true;
        }
    } catch (exc) {
        // Just ignore failed test localhost connections
    }

    // Default protocols if not specified
    if (typeof(protocols) === "undefined") {
        if (wsbt) {
            protocols = ['binary', 'base64'];
        } else {
            protocols = 'base64';
        }
    }

    // If no binary support, make sure it was not requested
    if (!wsbt) {
        if (protocols === 'binary') {
            throw("WebSocket binary sub-protocol requested but not supported");
        }
        if (typeof(protocols) === "object") {
            var new_protocols = [];
            for (var i = 0; i < protocols.length; i++) {
                if (protocols[i] === 'binary') {
                    Util.Error("Skipping unsupported WebSocket binary sub-protocol");
                } else {
                    new_protocols.push(protocols[i]);
                }
            }
            if (new_protocols.length > 0) {
                protocols = new_protocols;
            } else {
                throw("Only WebSocket binary sub-protocol was requested and not supported.");
            }
        }
    }

    return protocols;
}

function open(uri, protocols) {
    var ws_schema = uri.match(/^([a-z]+):\/\//)[1];
    protocols = init(protocols, ws_schema);

    if (test_mode) {
        websocket = {};
    } else {
        websocket = new WebSocket(uri, protocols);
        if (protocols.indexOf('binary') >= 0) {
            websocket.binaryType = 'arraybuffer';
        }
    }

    websocket.onmessage = recv_message;
    websocket.onopen = function() {
        Util.Debug(">> WebSock.onopen");
        if (websocket.protocol) {
            mode = websocket.protocol;
            Util.Info("Server chose sub-protocol: " + websocket.protocol);
        } else {
            mode = 'base64';
            Util.Error("Server select no sub-protocol!: " + websocket.protocol);
        }
        eventHandlers.open();
        Util.Debug("<< WebSock.onopen");
    };
    websocket.onclose = function(e) {
        Util.Debug(">> WebSock.onclose");
        eventHandlers.close(e);
        Util.Debug("<< WebSock.onclose");
    };
    websocket.onerror = function(e) {
        Util.Debug(">> WebSock.onerror: " + e);
        eventHandlers.error(e);
        Util.Debug("<< WebSock.onerror");
    };
}

function close() {
    if (websocket) {
        if ((websocket.readyState === WebSocket.OPEN) ||
            (websocket.readyState === WebSocket.CONNECTING)) {
            Util.Info("Closing WebSocket connection");
            websocket.close();
        }
        websocket.onmessage = function (e) { return; };
    }
}

// Override internal functions for testing
// Takes a send function, returns reference to recv function
function testMode(override_send, data_mode) {
    test_mode = true;
    mode = data_mode;
    api.send = override_send;
    api.close = function () {};
    return recv_message;
}

function constructor() {
    // Configuration settings
    api.maxBufferedAmount = 200;

    // Direct access to send and receive queues
    api.get_sQ       = get_sQ;
    api.get_rQ       = get_rQ;
    api.get_rQi      = get_rQi;
    api.set_rQi      = set_rQi;

    // Routines to read from the receive queue
    api.rQlen        = rQlen;
    api.rQpeek8      = rQpeek8;
    api.rQshift8     = rQshift8;
    api.rQunshift8   = rQunshift8;
    api.rQshift16    = rQshift16;
    api.rQshift32    = rQshift32;
    api.rQshiftStr   = rQshiftStr;
    api.rQshiftBytes = rQshiftBytes;
    api.rQslice      = rQslice;
    api.rQwait       = rQwait;

    api.flush        = flush;
    api.send         = send;
    api.send_string  = send_string;

    api.on           = on;
    api.init         = init;
    api.open         = open;
    api.close        = close;
    api.testMode     = testMode;

    return api;
}

return constructor();

}

; browserify_shim__define__module__export__(typeof Websock != "undefined" ? Websock : window.Websock);

}).call(global, undefined, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"1":1,"2":2}],4:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],5:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require(4)
var ieee754 = require(6)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('Invalid typed array length')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (isArrayBuffer(value)) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  return fromObject(value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj) {
    if (isArrayBufferView(obj) || 'length' in obj) {
      if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
        return createBuffer(0)
      }
      return fromArrayLike(obj)
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (isArrayBufferView(string) || isArrayBuffer(string)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : new Buffer(val, encoding)
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffers from another context (i.e. an iframe) do not pass the `instanceof` check
// but they should be treated as valid. See: https://github.com/feross/buffer/issues/166
function isArrayBuffer (obj) {
  return obj instanceof ArrayBuffer ||
    (obj != null && obj.constructor != null && obj.constructor.name === 'ArrayBuffer' &&
      typeof obj.byteLength === 'number')
}

// Node 0.10 supports `ArrayBuffer` but lacks `ArrayBuffer.isView`
function isArrayBufferView (obj) {
  return (typeof ArrayBuffer.isView === 'function') && ArrayBuffer.isView(obj)
}

function numberIsNaN (obj) {
  return obj !== obj // eslint-disable-line no-self-compare
}

},{"4":4,"6":6}],6:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],7:[function(require,module,exports){
(function (Buffer){
/**
 * Default export `Struct`.
 */
// export default Struct;
module.exports = exports = Struct;

// compatibility
exports.Struct = Struct;

function byteField(p, offset) {
    this.length = 1;
    this.offset = offset;
    this.get = function () {
        return p.buf[offset];
    }
    this.set = function (val) {
        p.buf[offset] = val;
    }
}

function boolField(p, offset, length) {
    this.length = length;
    this.offset = offset;
    this.get = function() {
        return (p.buf[offset] > 0);
    }
    this.set = function (val) {
        p.buf[offset] = val ? 1 : 0;
    }
}

function intField(p, offset, length, le, signed) {
    this.length = length;
    this.offset = offset;
    
    function bec(cb) {
        for (var i = 0; i < length; i++)
            cb(i, length - i - 1);
    }
    
    function lec(cb) {
        for (var i = 0; i < length; i++)
            cb(i, i);
    }
    
    function getUVal(bor) {
        var val = 0;
        bor(function (i, o) {
            val += Math.pow(256, o) * p.buf[offset + i];
        })
        return val;
    }
    
    function getSVal(bor) {
        
        var val = getUVal(bor);
        if ((p.buf[offset + (le ? (length - 1) : 0)] & 0x80) == 0x80) {
            val -= Math.pow(256, length);
        }
        return val;
    }
    
    function setVal(bor, val) {
        bor(function (i, o) {
            p.buf[offset + i] = Math.floor(val / Math.pow(256, o)) & 0xff;
        });
    }
    
    var 
     nativeSuff = (signed?'':'U') + 'Int' + (length * 8) + (le?'LE':'BE'),
        readMethod = Buffer.prototype['read' + nativeSuff], writeMethod = Buffer.prototype['write' + nativeSuff];
    
    
    if (!readMethod) {
        this.get = function () {
            var bor = le ? lec : bec;
            return (signed ? getSVal(bor) : getUVal(bor));
        }
    }
    else {
        this.get = function () {
            return readMethod.call(p.buf, offset);
        };
    }
    
    
    if (!writeMethod) {
        this.set = function (val) {
            var bor = le ? lec : bec;
            setVal(bor, val);
        }
    }
    else {
        this.set = function (val) {
            writeMethod.call(p.buf, val, offset);
        }
    }

}

function floatField(p, offset, le) {
    this.length = 4;
    this.offset = offset;
    this.get = function () {
        return le ? p.buf.readFloatLE(offset) : p.buf.readFloatBE(offset);
    }
    this.set = function (val) {
        return le ? p.buf.writeFloatLE(val, offset) : p.buf.writeFloatBE(val, offset);
    }
}

function doubleField(p, offset, le) {
    this.length = 8;
    this.offset = offset;
    this.get = function () {
        return le ? p.buf.readDoubleLE(offset) : p.buf.readDoubleBE(offset);
    }
    this.set = function (val) {
        return le ? p.buf.writeDoubleLE(val, offset) : p.buf.writeDoubleBE(val, offset);
    }
}

function charField(p, offset, length, encoding, secure) {
    var self = this;
    self.length = length;
    self.offset = offset;
    self.encoding = encoding;
    self.secure = secure;
    self.get = function () {
        if (!length)
            return;

        var result = p.buf.toString(self.encoding, offset, (offset + length));
        var strlen = result.indexOf("\0");
        if (strlen == -1) {
            return result;
        } else {
            return result.slice(0, strlen);
        }
    }
    self.set = function (val) {
        if (!length)
            return;
        
        // Be string is terminated with the null char, else troncate it
        if (secure === true) {
            
            // Append \0 to the string
            val += "\0";
            if (val.length >= length) {
                val = val.substring(0, length - 1);
                val += "\0";
            }
            
            // Write to buffer
            p.buf.write(val, offset, val.length, self.encoding);
            
            // Fill rest of the buffer with \0
            var remainSpace = (length - val.length);
            if (remainSpace > 0) {
                p.buf.fill(0, (offset + val.length), length);
            }

        } else {
            // Trust Buffer class to write the string into the buffer
            p.buf.write(val, offset, length, self.encoding);
        }
    }
}

function structField(p, offset, struct) {
    this.length = struct.length();
    this.offset = offset;
    this.get = function () {
        return struct;
    }
    this.set = function (val) {
        struct.set(val);
    }
    this.allocate = function () {
        struct._setBuff(p.buf.slice(offset, offset + struct.length()));
    }
}

function arrayField(p, offset, len, type) {
    var as = Struct();
    var args = [].slice.call(arguments, 4);
    args.unshift(0);
    for (var i = 0; i < len; i++) {
        if (type instanceof Struct) {
            as.struct(i, type.clone());
        } else if (type in as) {
            args[0] = i;
            as[type].apply(as, args);
        }
    }
    this.length = as.length();
    this.offset = offset;
    this.allocate = function () {
        as._setBuff(p.buf.slice(offset, offset + as.length()));
    }
    this.get = function () {
        return as;
    }
    this.set = function (val) {
        as.set(val);
    }
}

function Struct() {
    if (!(this instanceof Struct))
        return new Struct;
    
    var priv = {
        buf : {},
        allocated : false,
        len : 0,
        fields : {},
        closures : []
    }, self = this;
    
    function checkAllocated() {
        if (priv.allocated)
            throw new Error('Cant change struct after allocation');
    }
        
    // Create handlers for various float Field Variants
    [true, false].forEach(function (le) {
        self['float' + (le ? 'le' : 'be')] = function (key) {
            checkAllocated();
            priv.closures.push(function (p) {
                var n = 4;
                p.fields[key] = new floatField(p, p.len, le);
                p.len += n;
            });
            return this;
        }
    });
    
    // Create handlers for various double Field Variants
    [true, false].forEach(function (le) {
        self['double' + (le ? 'le' : 'be')] = function (key) {
            checkAllocated();
            priv.closures.push(function (p) {
                var n = 8;
                p.fields[key] = new doubleField(p, p.len, le);
                p.len += n;
            });
            return this;
        }
    });
    
    // Create handlers for various Bool Field Variants
    [1, 2, 3, 4].forEach(function (n) {
        self['bool' + (n == 1 ? '' : n)] = function (key) {
            checkAllocated();
            priv.closures.push(function (p) {
                p.fields[key] = new boolField(p, p.len, n);
                p.len += n;
            });
            return this;
        }
    });
    
    // Create handlers for various Integer Field Variants
    [1, 2, 3, 4, 6, 8].forEach(function (n) {
        [true, false].forEach(function (le) {
            [true, false].forEach(function (signed) {
                var name = 'word' + (n * 8) + (signed ? 'S' : 'U') + (le ? 'le' : 'be');
                self[name] = function (key) {
                    checkAllocated();
                    priv.closures.push(function (p) {
                        p.fields[key] = new intField(p, p.len, n, le, signed);
                        p.len += n;
                    });
                    return this;
                };
            });
        });
    });
    this.word8 = this.word8Ule;
    
    ['chars', 'charsnt'].forEach(function (c) {
        self[c] = function (key, length, encoding) {
            checkAllocated();
            priv.closures.push(function (p) {
                p.fields[key] = new charField(p, p.len, length, encoding || 'ascii', (c == 'charsnt'));
                p.len += length;
            });
            return this;
        }
    });

    this.struct = function (key, struct) {
        checkAllocated();
        priv.closures.push(function (p) {
            p.fields[key] = new structField(p, p.len, struct.clone());
            p.len += p.fields[key].length;
        });
        return this;
    }
    function construct(constructor, args) {
        function F() {
            return constructor.apply(this, args);
        }
        
        F.prototype = constructor.prototype;
        return new F();
    }
    
    
    this.array = function (key, length, type) {
        checkAllocated();
        var args = [].slice.call(arguments, 1);
        args.unshift(null);
        args.unshift(null);
        priv.closures.push(function (p) {
            args[0] = p;
            args[1] = p.len;
            p.fields[key] = construct(arrayField, args);
            p.len += p.fields[key].length;
        });
        
        return this;
    }
    var beenHere = false;
    
    function applyClosures(p) {
        if (beenHere)
            return;
        p.closures.forEach(function (el) {
            el(p);
        });
        beenHere = true;
    }
    
    function allocateFields() {
        for (var key in priv.fields) {
            if ('allocate' in priv.fields[key])
                priv.fields[key].allocate();
        }
    }
    
    this._setBuff = this.setBuffer = function (buff, buffLength) {
        applyClosures(priv);
        if (typeof (buffLength) === 'number') {
            if (buffLength > buff.length) {
                throw new Error('Invalid specified buffer size !');
            }
            priv.buf = buff.slice(0, buffLength);
        } else {
            priv.buf = buff;
        }
        if (priv.buf.length < priv.len) {
            throw new Error('Buffer size too small for struct layout !');
        }
        allocateFields();
        priv.allocated = true;
    }
    
    this.allocate = function () {
        applyClosures(priv);
        priv.buf = new Buffer(priv.len);
        allocateFields();
        priv.allocated = true;
        return this;
    }
    
    this._getPriv = function () {
        return priv;
    }
    
    this.getOffset = function (field) {
        if (priv.fields[field]) return priv.fields[field].offset;
    }
    
    this.clone = function () {
        var c = new Struct;
        var p = c._getPriv();
        p.closures = priv.closures.slice(0);
        return c;
    }
    
    this.length = function () {
        applyClosures(priv);
        return priv.len;
    }
    
    this.get = function (key) {
        if (key in priv.fields) {
            return priv.fields[key].get();
        } else
            throw new Error('Can not find field ' + key);
    }
    
    this.set = function (key, val) {
        if (arguments.length == 2) {
            if (key in priv.fields) {
                priv.fields[key].set(val);
            } else
                throw new Error('Can not find field ' + key);
        } else if (Buffer.isBuffer(key)) {
            this._setBuff(key);
        } else {
            for (var k in key) {
                this.set(k, key[k]);
            }
        }
    }
    this.buffer = function () {
        return priv.buf;
    }
    
    
    function getFields() {
        var fields = {};
        Object.keys(priv.fields).forEach(function (key) {
            var setFunc, getFunc;
            if (priv.fields[key] instanceof structField ||
               priv.fields[key] instanceof arrayField) {
                getFunc = function () {
                    return priv.fields[key].get().fields;
                };
                setFunc = function (newVal) {
                    self.set(key, newVal);
                };
            }
            else {
                getFunc = priv.fields[key].get;
                setFunc = priv.fields[key].set;
            };
            
            Object.defineProperty(fields, key, {
                get : getFunc,
                set : setFunc,
                enumerable : true
            });
        });
        return fields;
    };
    
    var _fields;
    Object.defineProperty(this, 'fields', {
        get : function () {
            if (_fields)
                return _fields;
            return (_fields = getFields());
        },
        enumerable : true,
        configurable : true
    });

}

}).call(this,require(5).Buffer)
},{"5":5}],8:[function(require,module,exports){
/**
 * @file
 * @author Daniel Roßner <daniel.rossner@iisys.de>
 */

//imports
var utgardUtil = require(15);
var WeightCalculator = require(16);

/**
 * Holds the status of the current identified clusters and its ids
 * @constructor
 * @class
 */
function Clusterstatus() {
    this._callback = function () {
        
    };
    this.kbcounter = 0;
    this.resetStatus();
}

/**
 *
 * @param {utgard.suggestionCallback} fnc
 */
Clusterstatus.prototype.setCallback = function (fnc) {
    this._callback = fnc;
};

/**
 * Resets the object to handle new incoming SSUIMessages with new cluster information.
 */
Clusterstatus.prototype.resetStatus = function () {
    this._clusters = [];
    this._aggregatedWeights = {};
};

/**
 * Sets the aggregated weights
 * @see {@link WeightCalculator#aggregate}
 * @param {object} aggWeights
 */
Clusterstatus.prototype.setAggregatedWeights = function (aggWeights) {
    this._aggregatedWeights = aggWeights;
};

/**
 * Increments internal KBUIMessage counter by 1 or n (if set).
 * @param {number} [n]
 * @private
 */
Clusterstatus.prototype._inc = function (n) {
    this.kbcounter += (n === undefined) ? 1 : n;
};

/**
 * Decrements internal KBUIMessage counter by 1.
 * @private
 */
Clusterstatus.prototype._dec = function () {
    this.kbcounter--;
};

/**
 @typedef {Object} Clusterstatus.ClusterEntry
 @property {Array.<SSUIMessage.ObjectID>} clusterEntities List of Object(ID)s which are in relation to each other
 @property {Array.<Number>} clusterSuggestionIds List of Suggestions for preliminary described clusterEntities
 @property {Array.<Clusterstatus.SugTuple>|undefined} clusterSuggestions List of SugTuples (URI/ weight)
 */
//[æt]property {Array.<String>|undefined} clusterSuggestions List of Suggestions for preliminary described clusterEntities

/**
 * @typedef {Object} Clusterstatus.SugTuple
 * @property {String} uri URI property of the suggestion
 * @property {Number} weight aggregated weight to the suggested entity/ uri
 */

/**
 *
 * @param {Clusterstatus.ClusterEntry} clusterEntry
 */
Clusterstatus.prototype.addCluster = function (clusterEntry) {
    this._inc(clusterEntry.clusterSuggestionIds.length);
    if(clusterEntry.clusterSuggestions === undefined){
        clusterEntry.clusterSuggestions = [];
    }
    this._clusters.push(clusterEntry);
};

/**
 * Adds URI information to the cached cluster.
 * @param entityId entityId
 * @param uri cubble resource uri like de.iisys.va.webpackage@13.37/supercubble
 */
Clusterstatus.prototype.resolveContent = function (entityId, uri) {
    //TODO: implement better distinction functionality (more efficent)
    this._dec();
    for(var i = 0, l = this._clusters.length; i < l; ++i){
        var suggIds = this._clusters[i].clusterSuggestionIds;
        for(var j = 0, l2 = suggIds.length; j < l2; ++j){
            if(entityId === suggIds[j]){
                this._clusters[i].clusterSuggestions.push({
                    uri: uri,
                    weight: this._aggregatedWeights[entityId.toString()] //TODO: maybe risky call, since number implementation in JS?
                });
            }
        }
        this._clusters[i].clusterSuggestions = utgardUtil.setify(this._clusters[i].clusterSuggestions);
        this._clusters[i].clusterSuggestions.sort(function (a, b) {
            return b.weight - a.weight; // sort desc weight (highest top)
        });
    }

    //if all KBUIMessages for the current status are received, one can inform the ui with an proper message
    if(this.kbcounter === 0 ){
        this._callback(this._clusters);
    }
};


module.exports = Clusterstatus;
},{"15":15,"16":16}],9:[function(require,module,exports){
(function (Buffer){
/**
 * @file Entry Point for external usage
 * @author Daniel Roßner <daniel.rossner@iisys.de>
 */

//imports
var Websock = require(3);
var Util = require(2);
var UISSMessage = require(14);
var SSUIMessage = require(12);
var KBResolver = require(10);
var Clusterstatus = require(8);

//private fields
var ws; //Websock object
var kbresolver;
var clusterstatus;

/**
 * @module utgard
 */
var exports = module.exports = {};

var receiveMsg = function () {
    //just notifies for new data in receive queue!!!
    //TODO: are we sure to have 8 Bytes?
    var headerBytes = ws.rQshiftBytes(8);
    var protocol = String.fromCharCode.apply(null, headerBytes.slice(0, 4));
    var buffer = assembleMessageBuffer(headerBytes);
    var msg;

    if (protocol === 'SSUI') {
        msg = new SSUIMessage(buffer);
        kbresolver.handleSSUIMessage(msg);
    }

    if (ws.rQlen() > 0) {
        receiveMsg(); // 'pseudo loop'
    }
};

var assembleMessageBuffer = function (headerBytes) {
    var buffer = new ArrayBuffer(2);
    var dv = new DataView(buffer);
    dv.setUint8(0, headerBytes.slice(6, 7));
    dv.setUint8(1, headerBytes.slice(7));
    var payloadLength = dv.getUint16();
    var payload = ws.rQshiftBytes(payloadLength);
    return Buffer.from(headerBytes.concat(payload));
};

var msgStore = [];

/**
 * Configuration
 * @type {{websockifyURL: string, websockifyPort: number, websockifyURL_KB: string, websockifyPort_KB: number}}
 * @default
 */
exports.config = {
    websockifyURL: 'ws://localhost',
    websockifyPort: 8070,
    websockifyURL_KB: 'ws://localhost',
    websockifyPort_KB: 9070
};

/**
 * Connects to the server an initializes the receive callback
 * @param {function} onOpen callback on successful connection
 * @param {function} onError callback on NOT successful connection
 */
exports.connectToServer = function (onOpen, onError) {
    var connectedToAsgard = false;
    ws = new Websock();
    ws.open(this.config.websockifyURL + ':' + this.config.websockifyPort);
    ws.on('message', receiveMsg);
    ws.on('close', console.log);
    ws.on('error', onError);
    ws.on('open', onOpen);
    ws.maxBufferedAmount = 999999; //hopefully this is enough todo error or warning for user in case of overlow?

    clusterstatus = new Clusterstatus();
    clusterstatus.setCallback(console.log);
    kbresolver = new KBResolver(this.config, clusterstatus, onOpen, onError);
};

/**
 * Shutdown all websocket connections of utgard
 */
exports.disconnect = function () {
  ws.close();
  kbresolver.disconnect();
};

/**
 * Callback type to receive data
 *
 * @callback suggestionCallback
 * @param {Array.<Clusterstatus.ClusterEntry>} data
 */

/**
 * Set callback function to receive data from server
 * @param {utgard#suggestionCallback} fnc
 */
exports.setCallback = function (fnc) {
    clusterstatus.setCallback(fnc);
};

/**
 * Remove the objects with the given ids
 * @param {Array.<number>} ids
 */
exports.removeObjects = function (ids) {
    var msg = new UISSMessage(Date.now(), true);
    msg.setAction(ids.length, msg.actions.remove).allocate({ids: ids});
    ws.send(msg.getByteArray());
};

/**
 * Adds messages encoded as JSON string {@link utgard#save}
 * @param string
 */
exports.addData = function (string) {
    var msgArr = JSON.parse(string);
    var uiss;
    for (var i = 0, l = msgArr.length; i < l - 1; i++) {
        uiss = new UISSMessage().loadFromData(msgArr[i], false);
        ws.send(uiss.getByteArray());
    }
    uiss = new UISSMessage().loadFromData(msgArr[i], true);
    ws.send(uiss.getByteArray());
};

/**
 *
 * @return string representation of all sent messages
 */
exports.save = function () {
    return JSON.stringify(msgStore);
};

/**
 * Tells the server, that there is a new object
 * @param {UISSMessage.newObject} data There are default values, except for data.id
 */
exports.addObject = function (data) {
    var defaultData = {
        id: data.id,
        r: data.r || 0x00,
        g: data.g || 0x00,
        b: data.b || 0x00,
        alpha: data.alpha || 0,
        shapeID: data.shapeID || 1,
        posX: data.posX || 0,
        posY: data.posY || 0,
        dimX: data.dimX || 1,
        dimY: data.dimY || 1,
        content: data.content || ''
    };

    var uissMsg = new UISSMessage(Date.now(), true);
    uissMsg.setAction(1, uissMsg.actions.add, defaultData.content.length).allocate({data: [defaultData]});
    msgStore.push(uissMsg.getMessageData());
    ws.send(uissMsg.getByteArray());
};

/**
 * Tells the server to change the color of an object
 * @param {number} r integer 0 to 255
 * @param {number} g integer 0 to 255
 * @param {number} b integer 0 to 255
 * @param id id of the object
 */
exports.changeColor = function (r, g, b, id) {
    var uissMsg = new UISSMessage(Date.now(), true);
    uissMsg.setAction(1, uissMsg.actions.changeColor).allocate({
        r: r,
        g: g,
        b: b,
        ids: [id]
    });
    msgStore.push(uissMsg.getMessageData());
    ws.send(uissMsg.getByteArray());
};

/**
 * Tells the server the new position of an object
 * @param {number} newX new x-position
 * @param {number} newY new y-position
 * @param {number} id id of the object
 */
exports.moveBoundingA = function (newX, newY, id) {
    var uissMsg = new UISSMessage(Date.now(), true);
    uissMsg.setAction(1, uissMsg.actions.moveBoundingA).allocate({
        newPosX: newX,
        newPosY: newY,
        ids: [id]
    });
    msgStore.push(uissMsg.getMessageData());
    ws.send(uissMsg.getByteArray());
};

/**
 * Tells the server the new content of an object
 * @param {string} content the new contentr
 * @param {number} id id of the object
 */
exports.changeContent = function (content, id) {
    var uissMsg = new UISSMessage(Date.now(), true);
    uissMsg.setAction(1, uissMsg.actions.changeContent, content.length).allocate({
        content: content,
        ids: [id]
    });
    msgStore.push(uissMsg.getMessageData());
    ws.send(uissMsg.getByteArray());
};

/**
 * Tells the server the new dimensions of an object
 * @param {number} newDimX new width
 * @param {number} newDimY new height
 * @param {number} id id of the object
 */
exports.resizeBoundingA = function (newDimX, newDimY, id) {
    var uissMsg = new UISSMessage(Date.now(), true);
    uissMsg.setAction(1, uissMsg.actions.resizeBoundingA).allocate({
        newDimX: newDimX,
        newDimY: newDimY,
        ids: [id]
    });
    msgStore.push(uissMsg.getMessageData());
    ws.send(uissMsg.getByteArray());
};

/**
 * Comfort method to convert 32bit hashes to 16bit unsigned values.
 *
 * May obviously produce collisions, thus use with care.
 * @param sint32
 * @return {number}
 */
exports.sint32ToUint16 = function(sint32){
    var dv = new DataView(new ArrayBuffer(4));
    dv.setInt32(0, sint32);

    var upper = dv.getUint16(0);
    var lower = dv.getUint16(2);

    return upper ^ lower;
};

}).call(this,require(5).Buffer)
},{"10":10,"12":12,"14":14,"2":2,"3":3,"5":5,"8":8}],10:[function(require,module,exports){
(function (Buffer){
/**
 * @file Class implementing content resolver for ssui messages
 * @author Daniel Roßner <daniel.rossner@iisys.de>
 */

//imports
var Websock = require(3);
var Util = require(2);
var utgardUtil = require(15);
var KBUIMessage = require(11);
var UIKBMessage = require(13);
var WeightCalculator = require(16);

/**
 * Constructs a new KBResolver Object
 * @param {utgard.config} config
 * @param {Clusterstatus} clusterStatus
 * @param {function} onOpen callback on successful connection
 * @param {function} onError callback on NOT successful connection
 * @constructor
 * @class
 * @classdesc Class implementing content resolver for ssui messages
 */
function KBResolver(config, clusterStatus, onOpen, onError){
    this._clusterStatus = clusterStatus;
    this._weightCalc = new WeightCalculator(WeightCalculator.methods.MEDIUM);
    this._ws = new Websock();
    this._ws.open(config.websockifyURL_KB + ':' + config.websockifyPort_KB);
    this._ws.on('message', this._receiveMsg.bind(this));
    this._ws.on('close', console.log);
    this._ws.on('error', onError);
    this._ws.on('open', onOpen);
    //KBUIMessage is 13 bytes long, 1040 => 80 messages
    this._ws.maxBufferedAmount = 999999;
}

/**
 * Shutdown the websocket connection.
 */
KBResolver.prototype.disconnect = function () {
    this._ws.close();
};

/**
 * Takes a SSUIMessages and resolves the entity IDs with a string content. In the Cubbles-World the content is
 * the "URI" (sth. similiar) of a cubble. For example: de.iisys.va.allmightywebpackage@13.37/solveMyProblem
 * @param {SSUIMessage} ssuimessage A SSUIMessage which content should be resolved
 */
KBResolver.prototype.handleSSUIMessage = function (ssuimessage) {
    //TODO: implement buffer
    var qCollections = ssuimessage.getQuadruples().qCollections;
    var resultArr = [];
    this._clusterStatus.resetStatus(); // the ssuimessage contains new cluster information -> all in one
    this._weightCalc.reset();
    for(var i = 0, l = qCollections.length; i < l; ++i){
        var qEntries = qCollections[i].data;
        var tempArr = [];
        var oIds = [];
        for(var j = 0, l2 = qEntries.length; j < l2; ++j){
            tempArr.push(qEntries[j].resultEntityID);
            oIds.push(qEntries[j].id);
            this._weightCalc.addIdWeightTuple(qEntries[j].resultEntityID, qEntries[j].edgeWeight);
        }
        tempArr = utgardUtil.setify(tempArr);
        oIds = utgardUtil.setify(oIds);
        this._clusterStatus.addCluster({clusterEntities: oIds,
                                        clusterSuggestionIds: tempArr});
        this._clusterStatus.setAggregatedWeights(this._weightCalc.aggregate());

        resultArr.push.apply(resultArr, tempArr);
    }
    this._sendUIKBMessages(resultArr);
};

/**
 * @param {KBUIMessage} kbuimessage
 */
KBResolver.prototype.handleKBUIMessage = function (kbuimessage) {
    var id = kbuimessage.getEdgeId();
    var content = kbuimessage.getContent();
    this._clusterStatus.resolveContent(id, content);
};

/**
 * Request the content (URI) of an entityId
 * @param {Array.<Number>} entityIds Array of entityIds, like used in the KB
 */
KBResolver.prototype._sendUIKBMessages = function(entityIds){
    for(var i = 0, l = entityIds.length; i < l; ++i){
        var msg = new UIKBMessage(entityIds[i], UIKBMessage.requestType.CONTENT, UIKBMessage.contentType.URI);
        this._ws.send(msg.getByteArray());
    }
};

/**
 * Receives messages from the KnowledgeBase
 * @private
 */
KBResolver.prototype._receiveMsg = function () {
    //just notifies for new data in receive queue!!!
    //TODO: are we sure to have 8 Bytes?
    var headerBytes = this._ws.rQshiftBytes(8);
    var protocol = String.fromCharCode.apply(null, headerBytes.slice(0, 4));
    var buffer = this._assembleMessageBuffer(headerBytes);
    var msg;

    if (protocol === 'KBUI') {
        msg = new KBUIMessage(buffer);
        this.handleKBUIMessage(msg);
    }

    if (this._ws.rQlen() > 0) {
        this._receiveMsg(); // 'pseudo loop'
    }
};

/**
 * Helper Method to assemble the bytes of a message
 * @param {Buffer} headerBytes the header bytes of a message
 * @private
 */
KBResolver.prototype._assembleMessageBuffer = function (headerBytes) {
    var buffer = new ArrayBuffer(2);
    var dv = new DataView(buffer);
    dv.setUint8(0, headerBytes.slice(6, 7));
    dv.setUint8(1, headerBytes.slice(7));
    var payloadLength = dv.getUint16();
    var payload = this._ws.rQshiftBytes(payloadLength);
    return Buffer.from(headerBytes.concat(payload));
};



module.exports = KBResolver;
}).call(this,require(5).Buffer)
},{"11":11,"13":13,"15":15,"16":16,"2":2,"3":3,"5":5}],11:[function(require,module,exports){
/**
 * @file Class implementing the the KBUI01 protocol structure
 * @author Daniel Roßner <daniel.rossner@iisys.de>
 */

//imports
var Struct = require(7);
var UIKBMessage = require(13);

//consts
/**
 * Denotes the Asgard Core Communication Service that is used.
 * @constant {string}
 * @default
 */
KBUIMessage.prototype.SERVICE = "KBUI";

/**
 * Denotes the Asgard Core Communication Service Version that is
 * implemented.
 * @constant {string}
 * @default
 */
KBUIMessage.prototype.VERSION = "01";

/**
 * Contructs a KBUIMessage object
 * @param {Buffer} data bytes read from network socket
 * @constructor
 */
function KBUIMessage(data) {
    this._contentLength = data.length - 13; //??
    this.type = data[8];

    this.Protocol = Struct()
        .chars('service', 4)
        .chars('version', 2)
        .word16Ube('size') //payload
        .word8('requestType')
        .word32Ube('edgeID');

    //raw sourceTripleStruct
    this._sourceTriple = function (uriLength) {
        Struct()
            .floatbe('strengthValue')
            .word16Ube('uriLength')
            .chars('uri', uriLength);
    };
    this._sourceTriples = [];

    if (this.type === UIKBMessage.requestType.NUMBER_OF_SOURCES || this.type === UIKBMessage.requestType.STRENGTH_VALUE) {
        var i = 18; //first length attribute in byte buffer (18+19)
        var keyCnt = 0;
        while (i + 1 < data.length()) {
            var dv = new DataView(new ArrayBuffer(2));
            dv.setUint8(0, data[i]);
            dv.setUint8(1, data[i + 1]);
            var length = dv.getUint16(0);
            var key = 'triple_' + keyCnt++;
            this.Protocol.struct(key, this._sourceTriple(length));
            this._sourceTriples.push(key);

            i = i + 1 + length + 4; // + 1 (16bit) + length (skip content) + 4 (strengthValue)
        }
    } else if (this.type === UIKBMessage.requestType.LIST_OF_CONTENTTYPES) {
        var typeCnt = this._contentLength - 5;
        this.Protocol.array('types', typeCnt, 'word8');
    } else {
        this.Protocol.word8('resType').word32Ube('resLength').chars('content', this._contentLength - 5);
    }

    this.Protocol.setBuffer(data);

}

/**
 @typedef {Object} KBUIMessage.sourceTuple
 @property {number} strengthValue strongness of the relation between uri and the edgeID in this message
 @property {string} uri URI
 */

/**
 * @returns {Array.<KBUIMessage.sourceTuple>|null} all found source triples (actually tuples, the length is omitted)
 * or null if the request type was not NUMBER_OF_SOURCES or STRENGTH VALUE
 */
KBUIMessage.prototype.getSourceTriples = function () {
    if (this.type !== UIKBMessage.requestType.NUMBER_OF_SOURCES || this.type !== UIKBMessage.requestType.STRENGTH_VALUE) {
        return null;
    }
    if (this._sourceTriples.length === 0) {
        return null;
    }
    var rc = [];
    for (var i = 0; i < this._sourceTriples.length; i++) {
        rc.push({
            strengthValue: this.Protocol.get(this._sourceTriples[i]).strengthValue,
            uri: this.Protocol.get(this._sourceTriples[i]).uri
        });
    }
    return rc;
};

/**
 * @returns {Array.<number>|null} supported content types or null if the request type was not LIST_OF_CONTENTTYPES
 */
KBUIMessage.prototype.getContentTypes = function () {
    if (this.type !== UIKBMessage.requestType.LIST_OF_CONTENTTYPES) {
        return null;
    }
    var rc = [];
    for (var i = 0; i < this._contentLength - 5; i++) {
        rc.push(this.Protocol.fields.types[i]);
    }
    return rc;
};

/**
 * @returns {string|null} content or null if the request type was not CONTENT
 */
KBUIMessage.prototype.getContent = function () {
    if (this.type !== UIKBMessage.requestType.CONTENT) {
        return null;
    }
    return this.Protocol.fields.content;
};

/**
 * @return {number} resource (edge or entity) id
 */
KBUIMessage.prototype.getEdgeId = function () {
    return this.Protocol.fields.edgeID;
};

module.exports = KBUIMessage;

},{"13":13,"7":7}],12:[function(require,module,exports){
/**
 * @file Class implementing the the SSUI01 protocol structure
 * @author Daniel Roßner <daniel.rossner@iisys.de>
 */

//imports
var Struct = require(7);
var utgardUtil = require(15);

/**
 * Constructs a new SSUIMessage object
 * @param {Buffer} data byte buffer received from asgard
 * @constructor
 * @class
 * @classdesc Class implementing the the SSUI01 protocol structure
 */
function SSUIMessage(data) {
    //init protocol structure
    this._contentLength = data.length - 8; // 8 header bytes

    var objectID = Struct().word8('nodeType').word16Ube('id');
    var contentStruct = Struct()
        .word32Ube('resultEntityID')
        .word32Ube('searchEntityID')
        .struct('objectID', objectID)
        .floatbe('edgeWeight');

    this.Protocol = Struct()
        .chars('service', 4)
        .chars('version', 2)
        .word16Ube('size');
    //.array('edgeQuadruple', this._contentLength / 15, contentStruct);

    //keys to address the object clusters
    this._quadrupleCollectionKeys = [];
    this._objectCollectionKeys = [];

    //search for 0x0000 delimiter to set struct mask properly
    var delimiterIndex;
    var i = 8;
    var dv = new DataView(new ArrayBuffer(2));
    var collectionSize;
    var key;
    while (i < data.length - 1) {
        if (data[i] === 0x00 && data[i + 1] === 0x00) {
            delimiterIndex = i + 1;
            this.Protocol.word16Ube('delimiter');
            i += 2;
            break;
        } else {
            dv.setUint8(0, data[i]);
            dv.setUint8(1, data[i + 1]);
            collectionSize = dv.getUint16(0);
            key = 'qCollection_' + i;
            var qCollection = Struct()
                .word16Ube('size')
                .array('edgeQuadruple', collectionSize, contentStruct);
            this.Protocol.struct(key, qCollection);
            this._quadrupleCollectionKeys.push(key);
            i += 2 + collectionSize * contentStruct.length(); //15 atm
        }
    }

    //mask object collection in the same way...
    while (i < data.length - 1) {
        dv.setUint8(0, data[i]);
        dv.setUint8(1, data[i + 1]);
        collectionSize = dv.getUint16(0);
        key = 'oCollection_' + i;
        var oCollection = Struct()
            .word16Ube('size')
            .array('objectID', collectionSize, objectID);
        this.Protocol.struct(key, oCollection);
        this._objectCollectionKeys.push(key);
        i += 2 + collectionSize * objectID.length(); // 3atm
    }

    //push byte buffer to protocol structure
    this.Protocol.setBuffer(data);
}

/**
 @typedef {Object} SSUIMessage.QuadrupleEntry
 @property {number} resultEntityID Result Entity ID, as used in the knowledge base
 @property {number} searchEntityID Search Entity ID, as used in the knowledge base
 @property {SSUIMessage.ObjectID} id ObjectID
 @property {number} edgeWeight 32 bit IEEE floating number in the range of 0 to 1),
 indicating the strength of the relation
 */

/**
 @typedef {Object} SSUIMessage.QuadrupleCollection
 @property {Array.<SSUIMessage.QuadrupleEntry>} data Array of data objects
 */

/**
 * @typedef {Object} SSUIMessage.ObjectID
 * @property {number} nodeType
 * @property {number} id
 */

/**
 * @typedef {Object} SSUIMessage.ObjectCollection
 * @property {Array.<SSUIMessage.ObjectID>} objects
 */

/**
 * @typedef {Object} SSUIMessage.Data
 * @property {Array.<SSUIMessage.QuadrupleCollection>} qCollections
 * @property {Array.<SSUIMessage.ObjectCollection>} oCollections
 */

/**
 * Assembles and returns a object containing the information of the received message
 * @returns {SSUIMessage.Data}
 */
SSUIMessage.prototype.getQuadruples = function () {
    var data = {
        qCollections: [],
        oCollections: []
    };
    var proxy = this.Protocol;
    var i = this._quadrupleCollectionKeys.length - 1;
    var key;
    for (i; i >= 0; i--) {
        key = this._quadrupleCollectionKeys[i];
        var quadCollectionEntry = proxy.get(key).fields;
        var collectionRes = {data: []};
        data.qCollections.push(collectionRes);
        for(var j = 0, l = quadCollectionEntry.size;  j < l; ++j){
            collectionRes.data.push(
                {
                    resultEntityID: quadCollectionEntry.edgeQuadruple[j].resultEntityID,
                    searchEntityID: quadCollectionEntry.edgeQuadruple[j].searchEntityID,
                    id: {
                        nodeType: quadCollectionEntry.edgeQuadruple[j].objectID.nodeType,
                        id: quadCollectionEntry.edgeQuadruple[j].objectID.id
                    },
                    edgeWeight: quadCollectionEntry.edgeQuadruple[j].edgeWeight
                }
            );
        }
    }

    i = this._objectCollectionKeys.length - 1;
    for (i; i >= 0; i--) {
        key = this._objectCollectionKeys[i];
        var objectCollectionEntry = proxy.get(key).fields;
        var objectRes = {objects: []};
        data.oCollections.push(objectRes);
        for(var n = 0, l2 = objectCollectionEntry.size;  n < l2; ++n){
            objectRes.objects.push(
                {
                    nodeType: objectCollectionEntry.objectID[n].nodeType,
                    id: objectCollectionEntry.objectID[n].id
                }
            );
        }
    }

    return data;
};

module.exports = SSUIMessage;
},{"15":15,"7":7}],13:[function(require,module,exports){
/**
 * @file Class implementing the the UIKB01 protocol structure
 * @author Daniel Roßner <daniel.rossner@iisys.de>
 */

//imports
var Struct = require(7);
var utgardUtil = require(15);

//consts
/**
 * Denotes the Asgard Core Communication Service that is used.
 * @constant {string}
 * @default
 */
UIKBMessage.prototype.SERVICE = "UIKB";

/**
 * Denotes the Asgard Core Communication Service Version that is
 * implemented.
 * @constant {string}
 * @default
 */
UIKBMessage.prototype.VERSION = "01";

/**
 * Constructs a new UIKBMessage object. Object is ready to use after constructed.
 * @param {number} edgeID id for which should be queried
 * @param {number} requestType derived from {@link UIKBMessage.requestType}
 * @param {...*} [param] type differs by requestType. NUMBER_OF_SOURCES and STRENGTH_VALUE -> number, CONTENT -> Repetition of
 * {@link UIKBMessage.contentType}s, LIST_OF_CONTENTTYPES -> param is not used in this case
 * @constructor
 */
function UIKBMessage(edgeID, requestType, param) {
    this.Protocol = Struct()
        .chars('service', 4)
        .chars('version', 2)
        .word16Ube('size') //payload
        .word8('requestType')
        .word32Ube('edgeID');

    switch (requestType) {
        case UIKBMessage.requestType.NUMBER_OF_SOURCES:
            this.Protocol.word8('nos');
            this.setup = function () {
                this.Protocol.fields.nos = param;
            };
            break;
        case UIKBMessage.requestType.STRENGTH_VALUE:
            this.Protocol.word32Ube('strength');
            this.setup = function () {
                this.Protocol.fields.strength = utgardUtil.float32ToBinary(param);
            };
            break;
        case UIKBMessage.requestType.LIST_OF_CONTENTTYPES:
            //do nothing, since there are no other data parts
            break;
        case UIKBMessage.requestType.CONTENT:
            var arr = Array.prototype.slice.call(arguments, 2);
            this.Protocol.array('content', param.length, 'word8');
            this.setup = function () {
                for (var i = 0; i < param.length; i++) {
                    this.Protocol.fields.content[i] = arr[i].charCodeAt(0);
                }
            };
            break;
        default: //should not happen, no feedback since this is not a public api
    }
    this.Protocol.allocate();
    var proxy = this.Protocol.fields;
    proxy.service = this.SERVICE;
    proxy.version = this.VERSION;
    proxy.size = this.Protocol.length() - 8;
    proxy.requestType = requestType;
    proxy.edgeID = edgeID;

    //call request specific setup method
    this.setup();
}

/**
 * Return the complete message as byte buffer object
 * @return {Buffer}
 */
UIKBMessage.prototype.getBytes = function () {
    return this.Protocol.buffer();
};

/**
 * Returns an array containing the protocol bytes
 * @returns {Array} protocol byte array
 */
UIKBMessage.prototype.getByteArray = function () {
    var rc = [];
    var byteBuffer = this.getBytes();
    for (var i = 0; i < byteBuffer.length; i++) {
        rc.push(byteBuffer[i] & 0xff);
    }
    return rc;
};

/**
 * Object containing the request types
 * @constant
 * @type {{NUMBER_OF_SOURCES: number, STRENGTH_VALUE: number, LIST_OF_CONTENT: number, CONTENT: number}}
 * @default
 */
UIKBMessage.requestType = {
    NUMBER_OF_SOURCES: 1,
    STRENGTH_VALUE: 2,
    LIST_OF_CONTENTTYPES: 4,
    CONTENT: 8
};

/**
 * Object containing all supported content types
 * @constant
 * @type {{IMAGE: number, KEYWORD: number, TEXT: number, URI: number}}
 * @default
 */
UIKBMessage.contentType = {
    IMAGE: 'I',
    KEYWORD: 'K',
    TEXT: 'T',
    URI: 'U'
};

module.exports = UIKBMessage;

},{"15":15,"7":7}],14:[function(require,module,exports){
/**
 * @file Class implementing the the UISS01 protocol structure
 * @author Daniel Roßner <daniel.rossner@iisys.de>
 */

//imports
var Struct = require(7);
var utgardUtil = require(15);

//consts
/**
 * Denotes the Asgard Core Communication Service that is used.
 * @constant {string}
 * @default
 */
UISSMessage.prototype.SERVICE = "UISS";

/**
 * Denotes the Asgard Core Communication Service Version that is
 * implemented.
 * @constant {string}
 * @default
 */
UISSMessage.prototype.VERSION = "01";

/**
 * Constructs a new UISSMessage object. Object is not ready to use after construction.
 * <ul style="list-style: none;">
 * <li> 1) var msg = new UISSMessage(millis, finalMessage)
 * <li> 2) msg.setAction(idCount, msg.actions.x, [content]).allocate();
 * <li> 3) use msg.getBytes() or msg.getByteArray() to send bytes to asgard
 * </ul>
 * @param {Number} [millis=0] millis of Date.now() in most cases
 * @param {Boolean} [finalMessage=true], flag intermediate messages with false
 * @constructor
 */
function UISSMessage(millis, finalMessage) {
    //set default values this way to be compliant with ES5
    finalMessage = finalMessage !== false;
    if (millis === undefined) {
        millis = 0;
    }
    // permit the usage of var x = UISSMessage(...) without new
    if (!(this instanceof UISSMessage)) {
        return new UISSMessage(millis, finalMessage);
    }

    // fields
    this.millis = millis;
    this.finalMessage = finalMessage;
    this._action = -1; //default nonsense value
    this._nodeTypeDefault = 128;
    this.setUpMethod = function () {
    };

    this.objectID = //function () {
        /* return */ Struct().word8('nodeType').word16Ube('id');
    //};
    //init Protocol structure
    this.Protocol = Struct()
    //header
        .chars('service', 4)
        .chars('version', 2)
        .word16Ube('size')
        //payload
        .word32Ube('timestamp')
        .word32Ube('fos') //fraction of second
        .word8('asp') //action specific flag
        .chars('actiontype', 1);

    this.actions = {
        add: ['+', _addObjects, _addObjectsParam],
        remove: ['-', _removeObjects, _removeObjectsParam],
        changeColor: ['C', _changeColor, _changeColorParam],
        moveBoundingA: ['M', _moveBoundingA, _moveBoundingAParam],
        changeContent: ['K', _changeContent, _changeContentParam],
        resizeBoundingA: ['R', _resizeBoundingA, _resizeBoundingAParam]
    };
}

/**
 * Initializes an UISSMessage from a js object created by {@link UISSMessage#getMessageData}
 * @param data valid json, for implementation simplicity, it is only allowed to use single-id messages
 * @param [finalMessage] overwrites flag information from the input data
 * @return {UISSMessage}
 */
UISSMessage.prototype.loadFromData = function (data, finalMessage) {
    //version check
    if (data.service !== this.SERVICE ||
        data.version !== this.VERSION) {
        throw 'Could not load file, version or error mismatch: ' +
        'found: ' + data.service + data.version + ' but expected ' +
        UISSMessage.service + UISSMessage.version;
    }

    var action;
    for (var prop in this.actions) {
        if (this.actions.hasOwnProperty(prop)) {
            if (this.actions[prop][0] === data.actiontype) {
                action = this.actions[prop];
            }
        }
    }
    //check action
    if (action === undefined) {
        throw 'Unknown action: ' + data.actiontype;
    }

    if (finalMessage !== undefined) {
        this.finalMessage = finalMessage;
    }

    //here starts the ugly part...
    //since idcount information is encoded in different ways and contentlength is only used for change and add -> we need
    //a nice if else structure
    var idcount, contentL;
    //todo: implement a nicer and safer method for idCount calculation
    if (action[0] === '+') { //must be hardcoded, sadly; add
        idcount = (data.params["1"] !== undefined) ? 42 : 1; //dirty hack, bc the bib encodes arrays of objects as objects in objects
        contentL = data.params[0].contentLength;
    } else if (action[0] === 'K') { //changeContent
        idcount = (data.ids["1"] !== undefined) ? 42 : 1; //dirty hack, bc the bib encodes arrays of objects as objects in objects
        contentL = data.length;
    } else { //everything else;
        idcount = (data.ids["1"] !== undefined) ? 42 : 1; //dirty hack, bc the bib encodes arrays of objects as objects in objects
    }

    if (idcount > 1) {
        throw 'idCount is only allowed to be 1, but it is ' + idcount;
    }

    this.setAction(idcount, action, contentL);
    var time = {
        seconds: data.timestamp,
        fracation: data.fos
    };

    //name a new object and give it all possible names, take care for the id ;)
    var mirroredData;
    if (action[0] === '+') {
        mirroredData = {
            data: [
                {
                    id: data.params[0].objectID.id,
                    r: data.params[0].r,
                    g: data.params[0].g,
                    b: data.params[0].b,
                    alpha: data.params[0].alpha,
                    shapeID: data.params[0].shapeID,
                    posX: data.params[0].posX,
                    posY: data.params[0].posY,
                    dimX: data.params[0].dimX,
                    dimY: data.params[0].dimY,
                    content: (data.params[0].content === undefined) ? '' : data.params[0].content
                }]
        };
    } else {
        mirroredData = {
            r: data.r,
            g: data.g,
            b: data.b,
            newPosX: data.newPosX,
            newPosY: data.newPosY,
            content: (data.content === undefined) ? '' : data.content,
            newDimX: data.newDimX,
            newDimY: data.newDimY,
            ids: [
                data.ids[0].id
            ]
        };
    }


    this.allocate(mirroredData, time);

    return this;
};

/**
 * Object containing supported actions. Data consists of action keys and the  corresponding [0] ascii character indicating
 * the action in the protocol, [1] a method to update the protocol structure and [2] a method to set the values of the
 * updated structure. This object is used to define the action type with the {@link UISSMessage#setAction} method.
 * @type {actions}
 */
UISSMessage.prototype.actions = this.actions;

/**
 * Allocates the internal byte buffer.
 * @param {Object} data the specific data for the set action. see {@link UISSMessage.newObject}, {@link UISSMessage.changeColorObj},
 * {@link UISSMessage.moveBoundingAObj}, {@link UISSMessage.resizeBoundingAObj} and {@link UISSMessage.changeContentObj}
 * @param {Object} [time] this is an optional parameter, if not set, method calculates the time with this.millis field
 * @returns {UISSMessage}
 */
UISSMessage.prototype.allocate = function (data, time) {
    if (time === undefined) {
        time = utgardUtil.toNtpTime(this.millis);
    }
    this.Protocol.allocate();
    this.Protocol.fields.service = this.SERVICE;
    this.Protocol.fields.version = this.VERSION;
    this.Protocol.fields.size = this.Protocol.length() - 8; //8 is the header length,
    this.Protocol.fields.timestamp = time.seconds;
    this.Protocol.fields.fos = time.fracation;
    this.Protocol.fields.asp = (this.finalMessage) ? 0x80 : 0x00;
    this.Protocol.fields.actiontype = this._action;
    this.setUpMethod(data);
    return this;
};

/**
 * Sets the actiontype, completes the protocol structure and sets the method called after allocate
 * @param {Number} idCount number of relevant ids
 * @param {Object} action a UISSMessage.actions.key
 * @param {Number} [contentLength] length of the action content (for add and change), thus setUpMethod can create correct structure
 * @returns {UISSMessage}
 */
UISSMessage.prototype.setAction = function (idCount, action, contentLength) {
    this._action = action[0];
    action[1].call(this, idCount, contentLength);
    this.setUpMethod = action[2].bind(this);
    return this;
};

/**
 * Return the header part of the message as formatted string value
 * @returns {String} "SERVICE+VERSION_size:_size"
 */
UISSMessage.prototype.getHeader = function () {
    return this.Protocol.fields.service + this.Protocol.fields.version + '_size:_' + this.Protocol.fields.size;
};

/**
 * Return the complete message as byte buffer object
 * @return {Buffer}
 */
UISSMessage.prototype.getBytes = function () {
    return this.Protocol.buffer();
};

/**
 * Returns an array containing the protocol bytes
 * @returns {Array} protocol byte array
 */
UISSMessage.prototype.getByteArray = function () {
    var rc = [];
    var byteBuffer = this.getBytes();
    for (var i = 0; i < byteBuffer.length; i++) {
        rc.push(byteBuffer[i] & 0xff);
    }
    return rc;
};

/**
 * @return {object} a object representation containing all the message fields
 */
UISSMessage.prototype.getMessageData = function () {
    return this.Protocol.fields;
};

// Private methods to build up the protocol structure and fill the fields

/**
 * Updates the protocol structure
 * @param {Number} idCount
 * @private
 */
var _removeObjects = function (idCount) {
    this.Protocol.array('ids', idCount, this.objectID);
};

/**
 * Sets the ids which should be deleted
 * @param {Object} data
 * @param {Array.<Number>} data.ids array of ids
 * @private
 */
var _removeObjectsParam = function (data) {
    var idArr = data.ids;
    for (var i = 0; i < idArr.length; i++) {
        this.Protocol.fields.ids[i].nodeType = this._nodeTypeDefault;
        this.Protocol.fields.ids[i].id = idArr[i];
    }
};

/**
 * Updates the protocol structure
 * @param {Number} idCount
 * @param {Number} contentLength length of the string content
 * @private
 */
var _addObjects = function (idCount, contentLength) {
    var paramObject = Struct()
        .struct('objectID', this.objectID)
        .word8('r')
        .word8('g')
        .word8('b')
        .word8('alpha')
        .word8('shapeID')
        .word16Ube('initLayer')
        .word32Sbe('posX')
        .word32Sbe('posY')
        .word16Ube('dimX')
        .word16Ube('dimY')
        .word8('contentLength')
        .chars('content', contentLength);

    this.Protocol.array('params', idCount, paramObject);
    //this.Protocol.struct('test', paramObject);
};

/**
 @typedef {Object} UISSMessage.newObject
 @property {number} id object id
 @property {number} r red value of the rgb code
 @property {number} g red value of the rgb code
 @property {number} b red value of the rgb code
 @property {number} alpha  alpha value
 @property {number} shapeID shapeID
 @property {number} posX the x coordinate
 @property {number} posY the y coordinate
 @property {number} dimX the x dimension
 @property {number} dimY the y dimenson
 @property {number} dimY the y dimenson
 @property {String} content content of the new object
 */

/**
 * Sets data which should be added
 * @param {Object} data
 * @param {Array.<UISSMessage.newObject>} data.data for new object
 * @private
 */
var _addObjectsParam = function (data) {
    var dataArr = data.data;
    var proxy = this.Protocol.fields;
    for (var i = 0; i < dataArr.length; i++) {
        proxy.params[i].objectID.nodeType = this._nodeTypeDefault;
        proxy.params[i].objectID.id = dataArr[i].id;
        proxy.params[i].r = dataArr[i].r;
        proxy.params[i].g = dataArr[i].g;
        proxy.params[i].b = dataArr[i].b;
        proxy.params[i].alpha = dataArr[i].alpha;
        proxy.params[i].shapeID = dataArr[i].shapeID;
        proxy.params[i].posX = dataArr[i].posX;
        proxy.params[i].posY = dataArr[i].posY;
        proxy.params[i].dimX = dataArr[i].dimX;
        proxy.params[i].dimY = dataArr[i].dimY;
        proxy.params[i].contentLength = dataArr[i].content.length;
        proxy.params[i].content = dataArr[i].content;
    }
};

/**
 * Updates the protocole structure
 * @param {Number} idCount
 * @private
 */
var _changeColor = function (idCount) {
    this.Protocol
        .word8('r')
        .word8('g')
        .word8('b')
        .array('ids', idCount, this.objectID);
};

/**
 @typedef {Object} UISSMessage.changeColorObj
 @property {number} r red value of the rgb code
 @property {number} g red value of the rgb code
 @property {number} b red value of the rgb code
 @property {Array.<Number>} ids
 */

 /**
 * Sets the changeColor data
  * @param {UISSMessage.changeColorObj} data
 * @private
 */
var _changeColorParam = function (data) {
    var proxy = this.Protocol.fields;
    proxy.r = data.r;
    proxy.g = data.g;
    proxy.b = data.b;
    var idArr = data.ids;
    for (var i = 0; i < idArr.length; i++) {
        proxy.ids[i].nodeType = this._nodeTypeDefault;
        proxy.ids[i].id = idArr[i];
    }
};

/**
 * Updates protocol structure
 * @param {Number} idCount
 * @private
 */
var _moveBoundingA = function (idCount) {
    this.Protocol
        .word32Sbe('newPosX')
        .word32Sbe('newPosY')
        .array('ids', idCount, this.objectID);
};

/**
 @typedef {Object} UISSMessage.moveBoundingAObj
 @property {number} newPosX new x position of the object(s)
 @property {number} newPosY new y position of the object(s)
 @property {Array.<Number>} ids
 */

/**
 * Sets the moveBoundingA data
 * @param {UISSMessage.moveBoundingAObj} data
 * @private
 */
var _moveBoundingAParam = function (data) {
    var proxy = this.Protocol.fields;
    proxy.newPosX = data.newPosX;
    proxy.newPosY = data.newPosY;
    var idArr = data.ids;
    for (var i = 0; i < idArr.length; i++) {
        proxy.ids[i].nodeType = this._nodeTypeDefault;
        proxy.ids[i].id = idArr[i];
    }

};

/**
 * Updates protocol structure
 * @param {Number} idCount
 * @param {Number} contentLength
 * @private
 */
var _changeContent = function (idCount, contentLength) {
    this.Protocol
        .word8('length')
        .chars('content', contentLength)
        .array('ids', idCount, this.objectID);
};

/**
 @typedef {Object} UISSMessage.changeContentObj
 @property {String} content new content of the object(s)
 @property {Array.<Number>} ids
 */

/**
 * Sets the changeContent data
 * @param {UISSMessage.changeContentObj} data
 * @private
 */
var _changeContentParam = function (data) {
    var proxy = this.Protocol.fields;
    proxy.content = data.content;
    proxy.length = data.content.length;
    var idArr = data.ids;
    for (var i = 0; i < idArr.length; i++) {
        proxy.ids[i].nodeType = this._nodeTypeDefault;
        proxy.ids[i].id = idArr[i];
    }
};

/**
 * Updates the protocol structure
 * @param idCount
 * @private
 */
var _resizeBoundingA = function (idCount) {
    this.Protocol
        .word16Ube('newDimX')
        .word16Ube('newDimY')
        .array('ids', idCount, this.objectID);
};

/**
 @typedef {Object} UISSMessage.resizeBoundingAObj
 @property {number} newDimX new width
 @property {number} newDimY new height
 @property {Array.<Number>} ids
 */

/**
 * Sets the resizeBoundingA data
 * @param {UISSMessage.resizeBoundingAObj} data
 * @private
 */
var _resizeBoundingAParam = function (data) {
    var proxy = this.Protocol.fields;
    proxy.newDimX = data.newDimX;
    proxy.newDimY = data.newDimY;
    var idArr = data.ids;
    for (var i = 0; i < idArr.length; i++) {
        proxy.ids[i].nodeType = this._nodeTypeDefault;
        proxy.ids[i].id = idArr[i];
    }
};

// exports module constructor and prototype properties
module.exports = UISSMessage;


},{"15":15,"7":7}],15:[function(require,module,exports){
/**
 * @file Includes several util methods
 * @author Daniel Roßner <daniel.rossner@iisys.de>
 */

/**
 * @module utgardUtil
 */
var exports = module.exports = {};

/**
 * Converts POSIX time to 64-bit NTP time representation.
 * 'Inspired' by {@link https://commons.apache.org/proper/commons-net/apidocs/src-html/org/apache/commons/net/ntp/TimeStamp.html}
 * @param {number} t milliseconds since 1970 (POSIX/ Unix)
 * @returns {number}
 */
exports.toNtpTime = function (t) {
    var useBase1 = t < 2085978496000; //baseline NTP time if bit-0=0 is 7-Feb-2036 @ 06:28:16 UTC
    var baseTime;
    if (useBase1) {
        baseTime = t - (-2208988800000); //dates <= Feb-2036
    } else {
        //if base0 needed for dates >= Feb-2036
        baseTime = t - 2085978496000;
    }
    var seconds = baseTime / 1000;
    var fraction = ((baseTime % 1000) * 4294967296) / 1000;

    /*if(!useBase1) {
     seconds |= 2147483648; //set high-order bit if msb1baseTime 1900 is used
     }*/ // at the moment not necessary because - idk, leads to bufferoverflow because of the negative result? need further checks
    //maybe use origin 0x80000000 instead of 2147..

    var time = {
        seconds: seconds,
        fracation: fraction
    };
    return time;
};

/**
 * Converts a js float number to an uint32, which also encodes the 32bit ieee 754 float
 * @param {number} number js floating point number
 * @returns {number} uint32 representation
 */
exports.float32ToBinary = function (number) {
    var dv = new DataView(new ArrayBuffer(4));
    dv.setFloat32(0, number);

    return dv.getUint32(0);
};

/**
 * 'Best guess' to convert the IEEE float data to a js value. Due to js number implementation, there are inaccuracies
 * @param uint32 uint interpretation of 4 bytes
 * @returns {number} float32 interpretation of the given 4 bytes
 */
exports.toFloat32 = function (uint32) {
    var view = new DataView(new ArrayBuffer(4));
    view.setUint32(0, uint32);
    return view.getFloat32(0);
};

/**
 * Shrinks an array to distinct values.
 * @param {Array} array an array
 * @return {Array} an array with distinct values
 */
exports.setify = function (array) {
    var rc = [];
    for(var i = 0, l = array.length; i < l; ++i){
        var isDistinctElement = true;
        for(var j = 0, l2 = rc.length; j < l2; ++j){
            if(this._extentedCompare(rc[j], array[i])){
                isDistinctElement = false;
                break;
            }
        }
        if(isDistinctElement){
            rc.push(array[i]);
        }
    }
    return rc;
};

/**
 * Compares two values or objects to level one (and only one)
 * @param {object} o1 first value
 * @param {object} o2 second value
 * @return {boolean} true if one and two are equal
 * @private
 */
exports._extentedCompare = function (o1, o2) {
    if(typeof o1 === 'object' && typeof o2 === 'object'){
        for(var p in o1){
            if(o1.hasOwnProperty(p)){
                if(o1[p] !== o2[p]){
                    return false;
                }
            }
        }
        for(var p in o2){
            if(o2.hasOwnProperty(p)){
                if(o1[p] !== o2[p]){
                    return false;
                }
            }
        }
        return true;
    } else {
        return o1 === o2;
    }
};

},{}],16:[function(require,module,exports){
/**
 * @file
 * @author Daniel Roßner <daniel.rossner@iisys.de>
 */

//imports
    //TODO: remove MultiMap, since it blows up the size of utgard for a very small benefit
//var MultiMap = require('collections/multi-map');
var MultiMap = require(17);

/**
 * This class manages the weight values of a entity. It offers different methods to aggregate these to one
 * single value.
 * @param {WeightCalculator.methods} behaviour the aggregation method
 * @constructor
 * @class
 */
function WeightCalculator(behaviour) {
    this._behaviour = behaviour;
    this._map = new MultiMap();
}

/**
 * @param {WeightCalculator.methods} behaviour the aggregation method
 */
WeightCalculator.prototype.setBehaviour = function(behaviour){
    this._behaviour = behaviour;
};

/**
 * These are the different types of weight aggregation. ARITHM_MEDIUM is the only one currently implemented.
 * @default
 * @type {{ADD: string, MEDIUM: string, MIN: string, MAX: string, ARITHM_MEDIUM: string}}
 */
WeightCalculator.methods = {
    ADD: 'ADD',                     //currently not implemented
    MEDIUM: 'MEDIUM',
    MIN: 'MIN',                     //currently not implemented
    MAX: 'MAX',                     //currently not implemented
    ARITHM_MEDIUM: 'ARITHM_MEDIUM'
};

/**
 * Resets the internal map to start a new weight aggregation.
 */
WeightCalculator.prototype.reset = function () {
    this._map.clear();
};

/**
 * Adds a new weight to a new or already existing entityId
 * @param {number} entityId target of the weight property
 * @param {number} weight the weight
 */
WeightCalculator.prototype.addIdWeightTuple = function (entityId, weight) {
    this._map.get(entityId).push(weight);
};

/**
 * Aggregates the collected weights.
 * @return { {entityId1: number, entityId2: number} } a map with entityId as key and the aggregated weight as value
 */
WeightCalculator.prototype.aggregate = function () {
    var rc = {};
    var entries = this._map.entries();
    if (this._behaviour === WeightCalculator.methods.ARITHM_MEDIUM) {
        entries.forEach(function (entry, i, iterator) {
            var avg = entry.value.average();
            rc[entry.key] = avg;
        });
    } else if (this._behaviour === WeightCalculator.methods.MEDIUM) {
        entries.forEach(function (entry, i, iterator) {
            var sortedArr = entry.value.sorted();
            var med = sortedArr[Math.floor(sortedArr.length/2)];
            rc[entry.key] = med;
        });
    }

    //return
    return rc;
};

module.exports = WeightCalculator;
},{"17":17}],17:[function(require,module,exports){
/**
 * @file
 * @author Daniel Roßner <daniel.rossner@iisys.de>
 */

/**
 * A Simple Multi Map implementation
 * @constructor
 * @class
 */
function SMultiMap() {
    this.clear();
}

SMultiMap.prototype.clear = function () {
    this.mapArray = [];
};

SMultiMap.prototype.get = function (key) {
    for(var i = 0, j = this.mapArray.length; i < j; i++){
        if(this.mapArray[i].key === key){
            return this.mapArray[i].value.get();
        }
    }

    var obj = {
        key: key,
        value: {
            val: [],

            get: function(){
                return this.val;
            },

            average: function(){
                var arr = this.get();
                var sum = 0;
                var j = arr.length;
                for(var i = 0; i < j; i++){
                    sum = sum + arr[i];
                }
                return sum/j;
            },

            sorted: function (){
                var arr = this.get();
                return arr.sort();
            }
        }
    };

    this.mapArray.push(obj);
    return obj.value.get();
};

SMultiMap.prototype.entries = function () {
    return this.mapArray;
};




module.exports = SMultiMap;
},{}]},{},[9])(9)
});