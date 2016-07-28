var UTILS = {
		throttle: require('lodash.throttle')
	},
    UI = (function(w, d) {
		'use strict';

		var load = function(src, cb) {
                    var t = document.createElement('script'),
                        s = document.getElementsByTagName('script')[0];
                    t.async = true;
                    t.src = src;
                    s.parentNode.insertBefore(t, s);
                    t.onload = cb;
            },
            ScrollSpy = require('./libs/storm-scrollspy'),
            polyfill = function(){
                load('https://cdn.polyfill.io/v2/polyfill.min.js?features=Object.assign,Element.prototype.classList,Promise&gated=1', init);
            },
			init = function() {
				var sp = ScrollSpy.init('.js-scrollspy');
                console.log(sp);
			};

		return {
			polyfill: polyfill
		};

	})(window, document, undefined);

global.STORM = {
    UTILS: UTILS,
    UI: UI
};

if('addEventListener' in window) window.addEventListener('DOMContentLoaded', STORM.UI.polyfill, false);

