(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var _stormLoad = require('storm-load');

var _stormLoad2 = _interopRequireDefault(_stormLoad);

var _stormTabs = require('storm-tabs');

var _stormTabs2 = _interopRequireDefault(_stormTabs);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var onDOMContentLoadedTasks = [function () {

	(0, _stormLoad2.default)('./js/storm-scroll-spy.standalone.js').then(function () {
		StormScrollSpy.init('.js-scroll-spy');
		_stormTabs2.default.init('.js-tabs');
	});
}];

if ('addEventListener' in window) window.addEventListener('DOMContentLoaded', function () {
	onDOMContentLoadedTasks.forEach(function (fn) {
		return fn();
	});
});

},{"storm-load":2,"storm-tabs":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * @name storm-load: Lightweight promise-based script loader
 * @version 0.5.1: Fri, 10 Mar 2017 17:30:13 GMT
 * @author stormid
 * @license MIT
 */
var create = function create(url) {
	var async = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	return new Promise(function (resolve, reject) {
		var s = document.createElement('script');
		s.src = url;
		s.async = async;
		s.onload = s.onreadystatechange = function () {
			if (!this.readyState || this.readyState === 'complete') resolve();
		};
		s.onerror = s.onabort = reject;
		document.head.appendChild(s);
	});
};

var synchronous = exports.synchronous = function synchronous(urls) {
	return new Promise(function (resolve, reject) {
		var next = function next() {
			if (!urls.length) return resolve();
			create(urls.shift(), false).then(next).catch(reject);
		};
		next();
	});
};

exports.default = function (urls) {
	var async = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	urls = [].concat(urls);
	if (!async) return synchronous(urls);

	return Promise.all(urls.map(function (url) {
		return create(url);
	}));
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defaults = require('./lib/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _componentPrototype = require('./lib/component-prototype');

var _componentPrototype2 = _interopRequireDefault(_componentPrototype);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @name storm-tabs: For multi-panelled content areas
 * @version 1.3.1: Fri, 09 Mar 2018 17:16:25 GMT
 * @author stormid
 * @license MIT
 */
var init = function init(sel, opts) {
	var els = [].slice.call(document.querySelectorAll(sel));

	if (!els.length) throw new Error('Tabs cannot be initialised, no augmentable elements found');

	return els.map(function (el) {
		return Object.assign(Object.create(_componentPrototype2.default), {
			DOMElement: el,
			settings: Object.assign({}, _defaults2.default, el.dataset, opts)
		}).init();
	});
};

exports.default = { init: init };

},{"./lib/component-prototype":4,"./lib/defaults":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var KEY_CODES = {
    SPACE: 32,
    ENTER: 13,
    TAB: 9,
    LEFT: 37,
    RIGHT: 39,
    DOWN: 40
};

exports.default = {
    init: function init() {
        var _this = this;

        var hash = location.hash.slice(1) || false;

        this.tabs = [].slice.call(this.DOMElement.querySelectorAll(this.settings.titleClass));
        this.panels = this.tabs.map(function (el) {
            return document.getElementById(el.getAttribute('href').substr(1)) || console.error('Tab target not found');
        });
        !!this.tabs.length && this.tabs[0].parentNode.setAttribute('role', 'tablist');
        this.current = this.settings.active;

        if (hash !== false) this.panels.forEach(function (target, i) {
            if (target.getAttribute('id') === hash) _this.current = i;
        });

        this.initAttributes().initTabs().open(this.current);

        return this;
    },
    initAttributes: function initAttributes() {
        var _this2 = this;

        this.tabs.forEach(function (tab, i) {
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', false);
            _this2.panels[i].setAttribute('aria-labelledby', tab.getAttribute('id'));
            tab.setAttribute('tabindex', '-1');
            _this2.panels[i].setAttribute('role', 'tabpanel');
            _this2.panels[i].setAttribute('hidden', 'hidden');
            _this2.panels[i].setAttribute('tabindex', '-1');
            if (!_this2.panels[i].firstElementChild || _this2.panels[i].firstElementChild.hasAttribute('tabindex')) return;
            _this2.panels[i].firstElementChild.setAttribute('tabindex', '-1');
        });
        return this;
    },
    initTabs: function initTabs() {
        var _this3 = this;

        var change = function change(id) {
            _this3.toggle(id);
            window.setTimeout(function () {
                _this3.tabs[_this3.current].focus();
            }, 16);
        },
            nextId = function nextId() {
            return _this3.current === _this3.tabs.length - 1 ? 0 : _this3.current + 1;
        },
            previousId = function previousId() {
            return _this3.current === 0 ? _this3.tabs.length - 1 : _this3.current - 1;
        };

        this.tabs.forEach(function (el, i) {
            el.addEventListener('keydown', function (e) {
                switch (e.keyCode) {
                    case KEY_CODES.LEFT:
                        change.call(_this3, previousId());
                        break;
                    case KEY_CODES.DOWN:
                        e.preventDefault();
                        e.stopPropagation();
                        _this3.panels[i].focus();
                        break;
                    case KEY_CODES.RIGHT:
                        change.call(_this3, nextId());
                        break;
                    case KEY_CODES.ENTER:
                        change.call(_this3, i);
                        break;
                    case KEY_CODES.SPACE:
                        e.preventDefault();
                        change.call(_this3, i);
                        break;
                    default:
                        break;
                }
            });
            el.addEventListener('click', function (e) {
                e.preventDefault();
                change.call(_this3, i);
            }, false);
        });

        return this;
    },
    change: function change(type, i) {
        this.tabs[i].classList[type === 'open' ? 'add' : 'remove'](this.settings.currentClass);
        this.panels[i].classList[type === 'open' ? 'add' : 'remove'](this.settings.currentClass);
        type === 'open' ? this.panels[i].removeAttribute('hidden') : this.panels[i].setAttribute('hidden', 'hidden');
        this.tabs[i].setAttribute('aria-selected', this.tabs[i].getAttribute('aria-selected') === 'true' ? 'false' : 'true');
        (type === 'open' ? this.tabs[i] : this.tabs[this.current]).setAttribute('tabindex', type === 'open' ? '0' : '-1');
        (type === 'open' ? this.panels[i] : this.panels[this.current]).setAttribute('tabindex', type === 'open' ? '0' : '-1');
    },
    open: function open(i) {
        this.change('open', i);
        this.current = i;
        return this;
    },
    close: function close(i) {
        this.change('close', i);
        return this;
    },
    toggle: function toggle(i) {
        if (this.current === i) return;

        this.settings.updateURL && window.history && window.history.replaceState({ URL: this.tabs[i].getAttribute('href') }, '', this.tabs[i].getAttribute('href'));
        if (this.current === null) this.open(i);else this.close(this.current).open(i);

        return this;
    }
};

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    titleClass: '.js-tabs__link',
    currentClass: 'active',
    updateURL: true,
    active: 0
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJub2RlX21vZHVsZXMvc3Rvcm0tbG9hZC9kaXN0L3N0b3JtLWxvYWQuanMiLCJub2RlX21vZHVsZXMvc3Rvcm0tdGFicy9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3N0b3JtLXRhYnMvZGlzdC9saWIvY29tcG9uZW50LXByb3RvdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9zdG9ybS10YWJzL2Rpc3QvbGliL2RlZmF1bHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7OztBQUNBOzs7Ozs7OztBQUVBLElBQU0sMkJBQTJCLFlBQU0sQUFFdEM7OzBCQUFBLEFBQUssdUNBQUwsQUFDRSxLQUFLLFlBQU0sQUFDWDtpQkFBQSxBQUFlLEtBQWYsQUFBb0IsQUFDcEI7c0JBQUEsQUFBSyxLQUFMLEFBQVUsQUFDVjtBQUpGLEFBS0E7QUFQRCxBQUFnQyxDQUFBOztBQVNoQyxJQUFHLHNCQUFILEFBQXlCLGVBQVEsQUFBTyxpQkFBUCxBQUF3QixvQkFBb0IsWUFBTSxBQUFFO3lCQUFBLEFBQXdCLFFBQVEsVUFBQSxBQUFDLElBQUQ7U0FBQSxBQUFRO0FBQXhDLEFBQWdEO0FBQXBHLENBQUE7Ozs7Ozs7O0FDWmpDOzs7Ozs7QUFNQSxJQUFNLFNBQVMsU0FBVCxNQUFTLENBQUMsR0FBRCxFQUF1QjtBQUFBLEtBQWpCLEtBQWlCLHVFQUFULElBQVM7O0FBQ3JDLFFBQU8sSUFBSSxPQUFKLENBQVksVUFBQyxPQUFELEVBQVUsTUFBVixFQUFxQjtBQUN2QyxNQUFJLElBQUksU0FBUyxhQUFULENBQXVCLFFBQXZCLENBQVI7QUFDQSxJQUFFLEdBQUYsR0FBUSxHQUFSO0FBQ0EsSUFBRSxLQUFGLEdBQVUsS0FBVjtBQUNBLElBQUUsTUFBRixHQUFXLEVBQUUsa0JBQUYsR0FBdUIsWUFBVztBQUM1QyxPQUFJLENBQUMsS0FBSyxVQUFO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WSxLQUFLLE9BQWpCLENBQXBDLEVBQStELFlBQS9ELENBQTRFLFVBQTVFLEVBQXlGLFNBQVMsTUFBVCxHQUFrQixHQUFsQixHQUF3QixJQUFqSDtBQUNILEtBL0VVO0FBZ0ZYLFFBaEZXLGdCQWdGTixDQWhGTSxFQWdGSDtBQUNKLGFBQUssTUFBTCxDQUFZLE1BQVosRUFBb0IsQ0FBcEI7QUFDQSxhQUFLLE9BQUwsR0FBZSxDQUFmO0FBQ0EsZUFBTyxJQUFQO0FBQ0gsS0FwRlU7QUFxRlgsU0FyRlcsaUJBcUZMLENBckZLLEVBcUZGO0FBQ0wsYUFBSyxNQUFMLENBQVksT0FBWixFQUFxQixDQUFyQjtBQUNBLGVBQU8sSUFBUDtBQUNILEtBeEZVO0FBeUZYLFVBekZXLGtCQXlGSixDQXpGSSxFQXlGRDtBQUNOLFlBQUcsS0FBSyxPQUFMLEtBQWlCLENBQXBCLEVBQXVCOztBQUV0QixhQUFLLFFBQUwsQ0FBYyxTQUFkLElBQTJCLE9BQU8sT0FBbkMsSUFBK0MsT0FBTyxPQUFQLENBQWUsWUFBZixDQUE0QixFQUFFLEtBQUssS0FBSyxJQUFMLENBQVUsQ0FBVixFQUFhLFlBQWIsQ0FBMEIsTUFBMUIsQ0FBUCxFQUE1QixFQUF3RSxFQUF4RSxFQUE0RSxLQUFLLElBQUwsQ0FBVSxDQUFWLEVBQWEsWUFBYixDQUEwQixNQUExQixDQUE1RSxDQUEvQztBQUNBLFlBQUcsS0FBSyxPQUFMLEtBQWlCLElBQXBCLEVBQTBCLEtBQUssSUFBTCxDQUFVLENBQVYsRUFBMUIsS0FDSyxLQUFLLEtBQUwsQ0FBVyxLQUFLLE9BQWhCLEVBQXlCLElBQXpCLENBQThCLENBQTlCOztBQUVMLGVBQU8sSUFBUDtBQUNIO0FBakdVLEM7Ozs7Ozs7O2tCQ1RBO0FBQ1gsZ0JBQVksZ0JBREQ7QUFFWCxrQkFBYyxRQUZIO0FBR1gsZUFBVyxJQUhBO0FBSVgsWUFBUTtBQUpHLEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsImltcG9ydCBMb2FkIGZyb20gJ3N0b3JtLWxvYWQnO1xuaW1wb3J0IFRhYnMgZnJvbSAnc3Rvcm0tdGFicyc7XG5cbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZFRhc2tzID0gWygpID0+IHtcblxuXHRMb2FkKCcuL2pzL3N0b3JtLXNjcm9sbC1zcHkuc3RhbmRhbG9uZS5qcycpXG5cdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0U3Rvcm1TY3JvbGxTcHkuaW5pdCgnLmpzLXNjcm9sbC1zcHknKTtcblx0XHRcdFRhYnMuaW5pdCgnLmpzLXRhYnMnKTtcblx0XHR9KTtcbn1dO1xuICAgIFxuaWYoJ2FkZEV2ZW50TGlzdGVuZXInIGluIHdpbmRvdykgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSk7IiwiLyoqXG4gKiBAbmFtZSBzdG9ybS1sb2FkOiBMaWdodHdlaWdodCBwcm9taXNlLWJhc2VkIHNjcmlwdCBsb2FkZXJcbiAqIEB2ZXJzaW9uIDAuNS4xOiBGcmksIDEwIE1hciAyMDE3IDE3OjMwOjEzIEdNVFxuICogQGF1dGhvciBzdG9ybWlkXG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuY29uc3QgY3JlYXRlID0gKHVybCwgYXN5bmMgPSB0cnVlKSA9PiB7XG5cdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0bGV0IHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcblx0XHRzLnNyYyA9IHVybDtcblx0XHRzLmFzeW5jID0gYXN5bmM7XG5cdFx0cy5vbmxvYWQgPSBzLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCF0aGlzLnJlYWR5U3RhdGUgfHwgdGhpcy5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSByZXNvbHZlKCk7XG5cdFx0fTtcblx0XHRzLm9uZXJyb3IgPSBzLm9uYWJvcnQgPSByZWplY3Q7XG5cdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzKTtcblx0fSk7XG59O1xuXG5leHBvcnQgY29uc3Qgc3luY2hyb25vdXMgPSB1cmxzID0+IHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRsZXQgbmV4dCA9ICgpID0+IHtcblx0XHRcdGlmICghdXJscy5sZW5ndGgpIHJldHVybiByZXNvbHZlKCk7XG5cdFx0XHRjcmVhdGUodXJscy5zaGlmdCgpLCBmYWxzZSkudGhlbihuZXh0KS5jYXRjaChyZWplY3QpO1xuXHRcdH07XG5cdFx0bmV4dCgpO1xuXHR9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0ICh1cmxzLCBhc3luYyA9IHRydWUpID0+IHtcblx0dXJscyA9IFtdLmNvbmNhdCh1cmxzKTtcblx0aWYgKCFhc3luYykgcmV0dXJuIHN5bmNocm9ub3VzKHVybHMpO1xuXG5cdHJldHVybiBQcm9taXNlLmFsbCh1cmxzLm1hcCh1cmwgPT4gY3JlYXRlKHVybCkpKTtcbn07IiwiLyoqXG4gKiBAbmFtZSBzdG9ybS10YWJzOiBGb3IgbXVsdGktcGFuZWxsZWQgY29udGVudCBhcmVhc1xuICogQHZlcnNpb24gMS4zLjE6IEZyaSwgMDkgTWFyIDIwMTggMTc6MTY6MjUgR01UXG4gKiBAYXV0aG9yIHN0b3JtaWRcbiAqIEBsaWNlbnNlIE1JVFxuICovXG5pbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xuaW1wb3J0IGNvbXBvbmVudFByb3RvdHlwZSBmcm9tICcuL2xpYi9jb21wb25lbnQtcHJvdG90eXBlJztcblxuY29uc3QgaW5pdCA9IChzZWwsIG9wdHMpID0+IHtcblx0bGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpKTtcblx0XG5cdGlmKCFlbHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ1RhYnMgY2Fubm90IGJlIGluaXRpYWxpc2VkLCBubyBhdWdtZW50YWJsZSBlbGVtZW50cyBmb3VuZCcpO1xuXG5cdHJldHVybiBlbHMubWFwKChlbCkgPT4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRcdERPTUVsZW1lbnQ6IGVsLFxuXHRcdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBlbC5kYXRhc2V0LCBvcHRzKVxuXHRcdH0pLmluaXQoKSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiLCJjb25zdCBLRVlfQ09ERVMgPSB7XG4gICAgU1BBQ0U6IDMyLFxuICAgIEVOVEVSOiAxMyxcbiAgICBUQUI6IDksXG4gICAgTEVGVDogMzcsXG4gICAgUklHSFQ6IDM5LFxuICAgIERPV046IDQwXG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgaW5pdCgpIHtcbiAgICAgICAgbGV0IGhhc2ggPSBsb2NhdGlvbi5oYXNoLnNsaWNlKDEpIHx8IGZhbHNlO1xuXG4gICAgICAgIHRoaXMudGFicyA9IFtdLnNsaWNlLmNhbGwodGhpcy5ET01FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5zZXR0aW5ncy50aXRsZUNsYXNzKSk7XG4gICAgICAgIHRoaXMucGFuZWxzID0gdGhpcy50YWJzLm1hcChlbCA9PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5zdWJzdHIoMSkpIHx8IGNvbnNvbGUuZXJyb3IoJ1RhYiB0YXJnZXQgbm90IGZvdW5kJykpO1xuICAgICAgICAhIXRoaXMudGFicy5sZW5ndGggJiYgdGhpcy50YWJzWzBdLnBhcmVudE5vZGUuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYmxpc3QnKTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5zZXR0aW5ncy5hY3RpdmU7XG5cbiAgICAgICAgaWYoaGFzaCAhPT0gZmFsc2UpIHRoaXMucGFuZWxzLmZvckVhY2goKHRhcmdldCwgaSkgPT4geyBpZiAodGFyZ2V0LmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gaGFzaCkgdGhpcy5jdXJyZW50ID0gaTsgfSk7XG5cbiAgICAgICAgdGhpcy5pbml0QXR0cmlidXRlcygpXG4gICAgICAgICAgICAuaW5pdFRhYnMoKVxuICAgICAgICAgICAgLm9wZW4odGhpcy5jdXJyZW50KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGluaXRBdHRyaWJ1dGVzKCkge1xuICAgICAgICB0aGlzLnRhYnMuZm9yRWFjaCgodGFiLCBpKSA9PiB7XG4gICAgICAgICAgICB0YWIuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYicpO1xuICAgICAgICAgICAgdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMucGFuZWxzW2ldLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbGxlZGJ5JywgdGFiLmdldEF0dHJpYnV0ZSgnaWQnKSk7XG4gICAgICAgICAgICB0YWIuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgICAgICAgICAgdGhpcy5wYW5lbHNbaV0uc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYnBhbmVsJyk7XG4gICAgICAgICAgICB0aGlzLnBhbmVsc1tpXS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICdoaWRkZW4nKTtcbiAgICAgICAgICAgIHRoaXMucGFuZWxzW2ldLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICAgICAgICAgIGlmKCF0aGlzLnBhbmVsc1tpXS5maXJzdEVsZW1lbnRDaGlsZCB8fCB0aGlzLnBhbmVsc1tpXS5maXJzdEVsZW1lbnRDaGlsZC5oYXNBdHRyaWJ1dGUoJ3RhYmluZGV4JykpIHJldHVybjtcbiAgICAgICAgICAgIHRoaXMucGFuZWxzW2ldLmZpcnN0RWxlbWVudENoaWxkLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaW5pdFRhYnMoKSB7XG4gICAgICAgIGxldCBjaGFuZ2UgPSBpZCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGUoaWQpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHsgdGhpcy50YWJzW3RoaXMuY3VycmVudF0uZm9jdXMoKTsgfSwgMTYpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5leHRJZCA9ICgpID0+ICh0aGlzLmN1cnJlbnQgPT09IHRoaXMudGFicy5sZW5ndGggLSAxID8gMCA6IHRoaXMuY3VycmVudCArIDEpLFxuICAgICAgICAgICAgcHJldmlvdXNJZCA9ICgpID0+ICh0aGlzLmN1cnJlbnQgPT09IDAgPyB0aGlzLnRhYnMubGVuZ3RoIC0gMSA6IHRoaXMuY3VycmVudCAtIDEpO1xuXG4gICAgICAgIHRoaXMudGFicy5mb3JFYWNoKChlbCwgaSkgPT4ge1xuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuTEVGVDpcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgcHJldmlvdXNJZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuRE9XTjpcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhbmVsc1tpXS5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5SSUdIVDpcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgbmV4dElkKCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5FTlRFUjpcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLlNQQUNFOlxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIGkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIGkpOyAgXG4gICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY2hhbmdlKHR5cGUsIGkpIHtcbiAgICAgICAgdGhpcy50YWJzW2ldLmNsYXNzTGlzdFsodHlwZSA9PT0gJ29wZW4nID8gJ2FkZCcgOiAncmVtb3ZlJyldKHRoaXMuc2V0dGluZ3MuY3VycmVudENsYXNzKTtcbiAgICAgICAgdGhpcy5wYW5lbHNbaV0uY2xhc3NMaXN0Wyh0eXBlID09PSAnb3BlbicgPyAnYWRkJyA6ICdyZW1vdmUnKV0odGhpcy5zZXR0aW5ncy5jdXJyZW50Q2xhc3MpO1xuICAgICAgICB0eXBlID09PSAnb3BlbicgPyB0aGlzLnBhbmVsc1tpXS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpIDogdGhpcy5wYW5lbHNbaV0uc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnaGlkZGVuJyk7XG4gICAgICAgIHRoaXMudGFic1tpXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCB0aGlzLnRhYnNbaV0uZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJyA/ICdmYWxzZScgOiAndHJ1ZScgKTtcbiAgICAgICAgKHR5cGUgPT09ICdvcGVuJyA/IHRoaXMudGFic1tpXSA6IHRoaXMudGFic1t0aGlzLmN1cnJlbnRdKS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgKHR5cGUgPT09ICdvcGVuJyA/ICcwJyA6ICctMScpKTtcbiAgICAgICAgKHR5cGUgPT09ICdvcGVuJyA/IHRoaXMucGFuZWxzW2ldIDogdGhpcy5wYW5lbHNbdGhpcy5jdXJyZW50XSkuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICh0eXBlID09PSAnb3BlbicgPyAnMCcgOiAnLTEnKSk7XG4gICAgfSxcbiAgICBvcGVuKGkpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2UoJ29wZW4nLCBpKTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gaTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjbG9zZShpKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlKCdjbG9zZScsIGkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHRvZ2dsZShpKSB7XG4gICAgICAgIGlmKHRoaXMuY3VycmVudCA9PT0gaSkgcmV0dXJuO1xuICAgICAgICBcbiAgICAgICAgKHRoaXMuc2V0dGluZ3MudXBkYXRlVVJMICYmIHdpbmRvdy5oaXN0b3J5KSAmJiB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoeyBVUkw6IHRoaXMudGFic1tpXS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSB9LCAnJywgdGhpcy50YWJzW2ldLmdldEF0dHJpYnV0ZSgnaHJlZicpKTtcbiAgICAgICAgaWYodGhpcy5jdXJyZW50ID09PSBudWxsKSB0aGlzLm9wZW4oaSk7XG4gICAgICAgIGVsc2UgdGhpcy5jbG9zZSh0aGlzLmN1cnJlbnQpLm9wZW4oaSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufTsiLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgdGl0bGVDbGFzczogJy5qcy10YWJzX19saW5rJyxcbiAgICBjdXJyZW50Q2xhc3M6ICdhY3RpdmUnLFxuICAgIHVwZGF0ZVVSTDogdHJ1ZSxcbiAgICBhY3RpdmU6IDBcbn07Il19
