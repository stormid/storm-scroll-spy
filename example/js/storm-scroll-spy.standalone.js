/**
 * @name storm-scroll-spy: Automated scroll position related navigation state management
 * @version 0.1.3: Fri, 11 Nov 2016 15:51:44 GMT
 * @author mjbp
 * @license MIT
 */
(function(root, factory) {
   var mod = {
       exports: {}
   };
   if (typeof exports !== 'undefined'){
       mod.exports = exports
       factory(mod.exports)
       module.exports = mod.exports.default
   } else {
       factory(mod.exports);
       root.StormScrollSpy = mod.exports.default
   }

}(this, function(exports) {
   'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _throttle = require('lodash/throttle');

var _throttle2 = _interopRequireDefault(_throttle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var docHeight = null;

var isHidden = function isHidden(el) {
	return el.offsetParent === null;
},
    inView = function inView(el) {
	if (isHidden(el)) return false;

	var view = {
		l: 0,
		t: 0,
		b: window.innerHeight || document.documentElement.clientHeight,
		r: window.innerWidth || document.documentElement.clientWidth
	},
	    box = el.getBoundingClientRect();
	return box.right >= view.l && box.bottom >= view.t && box.left <= view.r && box.top <= view.b;
},
    defaults = {
	offset: 0,
	activeClassName: 'active',
	callback: null
},
    StormScrollSpy = {
	init: function init() {
		this.navItems = this.getNavItems();
		this.setPositions();
		this.sortNavItems();
		this.setInitialActiveItem();
		this.setCurrentItem();
		this.initListeners();
		return this;
	},
	initListeners: function initListeners() {
		this.throttledScroll = (0, _throttle2.default)(function () {
			this.setCurrentItem();
		}.bind(this), 16);

		this.throttledResize = (0, _throttle2.default)(function () {
			this.setPositions();
			this.setCurrentItem();
		}.bind(this), 16);

		window.addEventListener('scroll', this.throttledScroll, false);
		window.addEventListener('scroll', this.throttledResize, false);
	},
	getNavItems: function getNavItems() {
		return this.DOMElements.map(function (item) {
			if (!item.hash || !document.querySelector(item.hash)) return;

			return {
				node: item,
				target: document.querySelector(item.hash),
				parent: item.parentNode.tagName.toLowerCase() === 'li' ? item.parentNode : null,
				position: 0
			};
		});
	},
	setPositions: function setPositions() {
		var _this = this;

		var getOffsetTop = function getOffsetTop(el) {
			var location = 0;
			if (el.offsetParent) {
				do {
					location += el.offsetTop;
					el = el.offsetParent;
				} while (el);
			} else {
				location = el.offsetTop;
			}
			location = location - _this.settings.offset;
			return location >= 0 ? location : 0;
		};

		docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
		this.navItems.forEach(function (item) {
			item.position = getOffsetTop(item.target);
		});
	},
	sortNavItems: function sortNavItems() {
		this.navItems.sort(function (a, b) {
			if (a.position > b.position) {
				return -1;
			}
			if (a.position < b.position) {
				return 1;
			}
			return 0;
		});
	},
	setInitialActiveItem: function setInitialActiveItem() {
		var _this2 = this;

		this.activeNavItem = this.navItems.filter(function (item) {
			return item.node.classList.contains(_this2.settings.activeClassName);
		})[0] || null;
	},
	setCurrentItem: function setCurrentItem() {
		var position = window.pageYOffset;

		//at the bottom and in view, choose the last one
		if (window.innerHeight + position >= docHeight && !!inView(this.navItems[0].node)) {
			this.toggle(this.navItems[0]);
			return this;
		}
		//find the next item
		for (var i = 0; i < this.navItems.length; i++) {
			if (this.navItems[i].position <= position) {
				this.toggle(this.navItems[i]);
				return this;
			}
		}
		//nothing found
		this.toggle(null);
		!!this.settings.callback && this.settings.callback();
	},
	toggle: function toggle(next) {
		if (this.activeNavItem === next) return;

		if (this.activeNavItem) {
			this.activeNavItem.node.classList.remove(this.settings.activeClassName);
		}
		this.activeNavItem = next;
		if (!next) return;

		next.node.classList.add(this.settings.activeClassName);
	}
};

var init = function init(sel, opts) {
	var els = [].slice.call(document.querySelectorAll(sel + ' a'));

	if (!els.length) throw new Error('Scroll Spy cannot be initialised, no augmentable elements found');

	return els.map(function (el) {
		return Object.assign(Object.create(StormScrollSpy), {
			DOMElements: els,
			settings: Object.assign({}, defaults, opts)
		}).init();
	});
};

exports.default = { init: init };;
}));
