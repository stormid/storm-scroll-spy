(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
 * @version 1.0.2: Fri, 09 Mar 2018 16:01:43 GMT
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJub2RlX21vZHVsZXMvc3Rvcm0tbG9hZC9kaXN0L3N0b3JtLWxvYWQuanMiLCJub2RlX21vZHVsZXMvc3Rvcm0tdGFicy9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3N0b3JtLXRhYnMvZGlzdC9saWIvY29tcG9uZW50LXByb3RvdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9zdG9ybS10YWJzL2Rpc3QvbGliL2RlZmF1bHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFBLGFBQUEsUUFBQSxZQUFBLENBQUE7Ozs7QUFDQSxJQUFBLGFBQUEsUUFBQSxZQUFBLENBQUE7Ozs7Ozs7O0FBRUEsSUFBTSwwQkFBMEIsQ0FBQyxZQUFNOztBQUV0QyxFQUFBLEdBQUEsWUFBQSxPQUFBLEVBQUEscUNBQUEsRUFBQSxJQUFBLENBQ08sWUFBTTtBQUNYLGlCQUFBLElBQUEsQ0FBQSxnQkFBQTtBQUNBLGNBQUEsT0FBQSxDQUFBLElBQUEsQ0FBQSxVQUFBO0FBSEYsRUFBQTtBQUZELENBQWdDLENBQWhDOztBQVNBLElBQUcsc0JBQUgsTUFBQSxFQUFpQyxPQUFBLGdCQUFBLENBQUEsa0JBQUEsRUFBNEMsWUFBTTtBQUFFLHlCQUFBLE9BQUEsQ0FBZ0MsVUFBQSxFQUFBLEVBQUE7QUFBQSxTQUFBLElBQUE7QUFBaEMsRUFBQTtBQUFwRCxDQUFBOzs7Ozs7OztBQ1pqQzs7Ozs7O0FBTUEsSUFBTSxTQUFTLFNBQVQsTUFBUyxDQUFDLEdBQUQsRUFBdUI7QUFBQSxLQUFqQixLQUFpQix1RUFBVCxJQUFTOztBQUNyQyxRQUFPLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7QUFDdkMsTUFBSSxJQUFJLFNBQVMsYUFBVCxDQUF1QixRQUF2QixDQUFSO0FBQ0EsSUFBRSxHQUFGLEdBQVEsR0FBUjtBQUNBLElB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QkNUQTtBQUNYLGdCQUFZLGdCQUREO0FBRVgsa0JBQWMsUUFGSDtBQUdYLGVBQVcsSUFIQTtBQUlYLFlBQVE7QUFKRyxDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IExvYWQgZnJvbSAnc3Rvcm0tbG9hZCc7XG5pbXBvcnQgVGFicyBmcm9tICdzdG9ybS10YWJzJztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuXG5cdExvYWQoJy4vanMvc3Rvcm0tc2Nyb2xsLXNweS5zdGFuZGFsb25lLmpzJylcblx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRTdG9ybVNjcm9sbFNweS5pbml0KCcuanMtc2Nyb2xsLXNweScpO1xuXHRcdFx0VGFicy5pbml0KCcuanMtdGFicycpO1xuXHRcdH0pO1xufV07XG4gICAgXG5pZignYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93KSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHsgb25ET01Db250ZW50TG9hZGVkVGFza3MuZm9yRWFjaCgoZm4pID0+IGZuKCkpOyB9KTsiLCIvKipcbiAqIEBuYW1lIHN0b3JtLWxvYWQ6IExpZ2h0d2VpZ2h0IHByb21pc2UtYmFzZWQgc2NyaXB0IGxvYWRlclxuICogQHZlcnNpb24gMS4wLjI6IEZyaSwgMDkgTWFyIDIwMTggMTY6MDE6NDMgR01UXG4gKiBAYXV0aG9yIHN0b3JtaWRcbiAqIEBsaWNlbnNlIE1JVFxuICovXG5jb25zdCBjcmVhdGUgPSAodXJsLCBhc3luYyA9IHRydWUpID0+IHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRsZXQgcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXHRcdHMuc3JjID0gdXJsO1xuXHRcdHMuYXN5bmMgPSBhc3luYztcblx0XHRzLm9ubG9hZCA9IHMub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIXRoaXMucmVhZHlTdGF0ZSB8fCB0aGlzLnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHJlc29sdmUoKTtcblx0XHR9O1xuXHRcdHMub25lcnJvciA9IHMub25hYm9ydCA9IHJlamVjdDtcblx0XHRkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHMpO1xuXHR9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBzeW5jaHJvbm91cyA9IHVybHMgPT4ge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdGxldCBuZXh0ID0gKCkgPT4ge1xuXHRcdFx0aWYgKCF1cmxzLmxlbmd0aCkgcmV0dXJuIHJlc29sdmUoKTtcblx0XHRcdGNyZWF0ZSh1cmxzLnNoaWZ0KCksIGZhbHNlKS50aGVuKG5leHQpLmNhdGNoKHJlamVjdCk7XG5cdFx0fTtcblx0XHRuZXh0KCk7XG5cdH0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgKHVybHMsIGFzeW5jID0gdHJ1ZSkgPT4ge1xuXHR1cmxzID0gW10uY29uY2F0KHVybHMpO1xuXHRpZiAoIWFzeW5jKSByZXR1cm4gc3luY2hyb25vdXModXJscyk7XG5cblx0cmV0dXJuIFByb21pc2UuYWxsKHVybHMubWFwKHVybCA9PiBjcmVhdGUodXJsKSkpO1xufTsiLCIvKipcbiAqIEBuYW1lIHN0b3JtLXRhYnM6IEZvciBtdWx0aS1wYW5lbGxlZCBjb250ZW50IGFyZWFzXG4gKiBAdmVyc2lvbiAxLjMuMTogRnJpLCAwOSBNYXIgMjAxOCAxNzoxNjoyNSBHTVRcbiAqIEBhdXRob3Igc3Rvcm1pZFxuICogQGxpY2Vuc2UgTUlUXG4gKi9cbmltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9kZWZhdWx0cyc7XG5pbXBvcnQgY29tcG9uZW50UHJvdG90eXBlIGZyb20gJy4vbGliL2NvbXBvbmVudC1wcm90b3R5cGUnO1xuXG5jb25zdCBpbml0ID0gKHNlbCwgb3B0cykgPT4ge1xuXHRsZXQgZWxzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpO1xuXHRcblx0aWYoIWVscy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignVGFicyBjYW5ub3QgYmUgaW5pdGlhbGlzZWQsIG5vIGF1Z21lbnRhYmxlIGVsZW1lbnRzIGZvdW5kJyk7XG5cblx0cmV0dXJuIGVscy5tYXAoKGVsKSA9PiBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoY29tcG9uZW50UHJvdG90eXBlKSwge1xuXHRcdFx0RE9NRWxlbWVudDogZWwsXG5cdFx0XHRzZXR0aW5nczogT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIGVsLmRhdGFzZXQsIG9wdHMpXG5cdFx0fSkuaW5pdCgpKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsImNvbnN0IEtFWV9DT0RFUyA9IHtcbiAgICBTUEFDRTogMzIsXG4gICAgRU5URVI6IDEzLFxuICAgIFRBQjogOSxcbiAgICBMRUZUOiAzNyxcbiAgICBSSUdIVDogMzksXG4gICAgRE9XTjogNDBcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBpbml0KCkge1xuICAgICAgICBsZXQgaGFzaCA9IGxvY2F0aW9uLmhhc2guc2xpY2UoMSkgfHwgZmFsc2U7XG5cbiAgICAgICAgdGhpcy50YWJzID0gW10uc2xpY2UuY2FsbCh0aGlzLkRPTUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnNldHRpbmdzLnRpdGxlQ2xhc3MpKTtcbiAgICAgICAgdGhpcy5wYW5lbHMgPSB0aGlzLnRhYnMubWFwKGVsID0+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsLmdldEF0dHJpYnV0ZSgnaHJlZicpLnN1YnN0cigxKSkgfHwgY29uc29sZS5lcnJvcignVGFiIHRhcmdldCBub3QgZm91bmQnKSk7XG4gICAgICAgICEhdGhpcy50YWJzLmxlbmd0aCAmJiB0aGlzLnRhYnNbMF0ucGFyZW50Tm9kZS5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndGFibGlzdCcpO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLnNldHRpbmdzLmFjdGl2ZTtcblxuICAgICAgICBpZihoYXNoICE9PSBmYWxzZSkgdGhpcy5wYW5lbHMuZm9yRWFjaCgodGFyZ2V0LCBpKSA9PiB7IGlmICh0YXJnZXQuZ2V0QXR0cmlidXRlKCdpZCcpID09PSBoYXNoKSB0aGlzLmN1cnJlbnQgPSBpOyB9KTtcblxuICAgICAgICB0aGlzLmluaXRBdHRyaWJ1dGVzKClcbiAgICAgICAgICAgIC5pbml0VGFicygpXG4gICAgICAgICAgICAub3Blbih0aGlzLmN1cnJlbnQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaW5pdEF0dHJpYnV0ZXMoKSB7XG4gICAgICAgIHRoaXMudGFicy5mb3JFYWNoKCh0YWIsIGkpID0+IHtcbiAgICAgICAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndGFiJyk7XG4gICAgICAgICAgICB0YWIuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5wYW5lbHNbaV0uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknLCB0YWIuZ2V0QXR0cmlidXRlKCdpZCcpKTtcbiAgICAgICAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgICAgICAgICB0aGlzLnBhbmVsc1tpXS5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndGFicGFuZWwnKTtcbiAgICAgICAgICAgIHRoaXMucGFuZWxzW2ldLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJ2hpZGRlbicpO1xuICAgICAgICAgICAgdGhpcy5wYW5lbHNbaV0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgICAgICAgICAgaWYoIXRoaXMucGFuZWxzW2ldLmZpcnN0RWxlbWVudENoaWxkIHx8IHRoaXMucGFuZWxzW2ldLmZpcnN0RWxlbWVudENoaWxkLmhhc0F0dHJpYnV0ZSgndGFiaW5kZXgnKSkgcmV0dXJuO1xuICAgICAgICAgICAgdGhpcy5wYW5lbHNbaV0uZmlyc3RFbGVtZW50Q2hpbGQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBpbml0VGFicygpIHtcbiAgICAgICAgbGV0IGNoYW5nZSA9IGlkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZShpZCk7XG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnRhYnNbdGhpcy5jdXJyZW50XS5mb2N1cygpOyB9LCAxNik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmV4dElkID0gKCkgPT4gKHRoaXMuY3VycmVudCA9PT0gdGhpcy50YWJzLmxlbmd0aCAtIDEgPyAwIDogdGhpcy5jdXJyZW50ICsgMSksXG4gICAgICAgICAgICBwcmV2aW91c0lkID0gKCkgPT4gKHRoaXMuY3VycmVudCA9PT0gMCA/IHRoaXMudGFicy5sZW5ndGggLSAxIDogdGhpcy5jdXJyZW50IC0gMSk7XG5cbiAgICAgICAgdGhpcy50YWJzLmZvckVhY2goKGVsLCBpKSA9PiB7XG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZSA9PiB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5MRUZUOlxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBwcmV2aW91c0lkKCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5ET1dOOlxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFuZWxzW2ldLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLlJJR0hUOlxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBuZXh0SWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLkVOVEVSOlxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2UuY2FsbCh0aGlzLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuU1BBQ0U6XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgaSk7ICBcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjaGFuZ2UodHlwZSwgaSkge1xuICAgICAgICB0aGlzLnRhYnNbaV0uY2xhc3NMaXN0Wyh0eXBlID09PSAnb3BlbicgPyAnYWRkJyA6ICdyZW1vdmUnKV0odGhpcy5zZXR0aW5ncy5jdXJyZW50Q2xhc3MpO1xuICAgICAgICB0aGlzLnBhbmVsc1tpXS5jbGFzc0xpc3RbKHR5cGUgPT09ICdvcGVuJyA/ICdhZGQnIDogJ3JlbW92ZScpXSh0aGlzLnNldHRpbmdzLmN1cnJlbnRDbGFzcyk7XG4gICAgICAgIHR5cGUgPT09ICdvcGVuJyA/IHRoaXMucGFuZWxzW2ldLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJykgOiB0aGlzLnBhbmVsc1tpXS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICdoaWRkZW4nKTtcbiAgICAgICAgdGhpcy50YWJzW2ldLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIHRoaXMudGFic1tpXS5nZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnKSA9PT0gJ3RydWUnID8gJ2ZhbHNlJyA6ICd0cnVlJyApO1xuICAgICAgICAodHlwZSA9PT0gJ29wZW4nID8gdGhpcy50YWJzW2ldIDogdGhpcy50YWJzW3RoaXMuY3VycmVudF0pLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAodHlwZSA9PT0gJ29wZW4nID8gJzAnIDogJy0xJykpO1xuICAgICAgICAodHlwZSA9PT0gJ29wZW4nID8gdGhpcy5wYW5lbHNbaV0gOiB0aGlzLnBhbmVsc1t0aGlzLmN1cnJlbnRdKS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgKHR5cGUgPT09ICdvcGVuJyA/ICcwJyA6ICctMScpKTtcbiAgICB9LFxuICAgIG9wZW4oaSkge1xuICAgICAgICB0aGlzLmNoYW5nZSgnb3BlbicsIGkpO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSBpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNsb3NlKGkpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2UoJ2Nsb3NlJywgaSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgdG9nZ2xlKGkpIHtcbiAgICAgICAgaWYodGhpcy5jdXJyZW50ID09PSBpKSByZXR1cm47XG4gICAgICAgIFxuICAgICAgICAodGhpcy5zZXR0aW5ncy51cGRhdGVVUkwgJiYgd2luZG93Lmhpc3RvcnkpICYmIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7IFVSTDogdGhpcy50YWJzW2ldLmdldEF0dHJpYnV0ZSgnaHJlZicpIH0sICcnLCB0aGlzLnRhYnNbaV0uZ2V0QXR0cmlidXRlKCdocmVmJykpO1xuICAgICAgICBpZih0aGlzLmN1cnJlbnQgPT09IG51bGwpIHRoaXMub3BlbihpKTtcbiAgICAgICAgZWxzZSB0aGlzLmNsb3NlKHRoaXMuY3VycmVudCkub3BlbihpKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICB0aXRsZUNsYXNzOiAnLmpzLXRhYnNfX2xpbmsnLFxuICAgIGN1cnJlbnRDbGFzczogJ2FjdGl2ZScsXG4gICAgdXBkYXRlVVJMOiB0cnVlLFxuICAgIGFjdGl2ZTogMFxufTsiXX0=
