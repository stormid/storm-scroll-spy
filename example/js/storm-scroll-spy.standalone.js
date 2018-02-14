/**
 * @name storm-scroll-spy: Automated scroll position-related navigation state management
 * @version 1.0.4: Thu, 01 Feb 2018 12:24:28 GMT
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
var defaults = {
    offset: 0,
    activeClassName: 'active',
    callback: null
};

function unwrapExports(x) {
    return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
    return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var rafThrottle_1 = createCommonjsModule(function (module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var rafThrottle = function rafThrottle(callback) {
        var requestId = void 0;

        var later = function later(context, args) {
            return function () {
                requestId = null;
                callback.apply(context, args);
            };
        };

        var throttled = function throttled() {
            if (requestId === null || requestId === undefined) {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                requestId = requestAnimationFrame(later(this, args));
            }
        };

        throttled.cancel = function () {
            return cancelAnimationFrame(requestId);
        };

        return throttled;
    };

    exports.default = rafThrottle;
});

var throttle = unwrapExports(rafThrottle_1);

var isHidden = function isHidden(el) {
    return el.offsetParent === null;
};
var inView = function inView(el) {
    if (isHidden(el)) return false;

    var box = el.getBoundingClientRect();
    return box.right >= 0 && box.bottom >= 0 && box.left <= (window.innerWidth || document.documentElement.clientWidth) && box.top <= (window.innerWidth || document.documentElement.clientWidth);
};

var docHeight = void 0;

var componentPrototype = {
    init: function init() {
        var _this = this;

        this.navItems = this.getNavItems();
        this.setPositions();
        this.sortNavItems();
        this.activeNavItem = this.navItems.filter(function (item) {
            return item.node.classList.contains(_this.settings.activeClassName);
        })[0] || null;
        this.setCurrentItem();
        this.initListeners();
        return this;
    },
    initListeners: function initListeners() {
        var _this2 = this;

        this.throttledScroll = throttle(this.setCurrentItem.bind(this));

        this.throttledResize = throttle(function () {
            _this2.setPositions();
            _this2.setCurrentItem();
        });

        window.addEventListener('scroll', this.throttledScroll, false);
        window.addEventListener('resize', this.throttledResize, false);
    },
    getNavItems: function getNavItems() {
        return this.DOMElements.map(function (item) {
            if (!item.hash || !document.querySelector(item.hash)) return null;

            return {
                node: item,
                target: document.querySelector(item.hash),
                parent: item.parentNode.tagName.toLowerCase() === 'li' ? item.parentNode : null,
                position: 0
            };
        });
    },
    setPositions: function setPositions() {
        var _this3 = this;

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
            location = location - _this3.settings.offset;
            return location >= 0 ? location : 0;
        };

        docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
        this.navItems.forEach(function (item) {
            item.position = getOffsetTop(item.target);
        });
    },
    sortNavItems: function sortNavItems() {
        this.navItems.sort(function (a, b) {
            if (a.position > b.position) return -1;
            if (a.position < b.position) return 1;
            return 0;
        });
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
        !!this.settings.callback && typeof this.settings.prehook === 'function' && this.settings.callback();
    },
    toggle: function toggle(next) {
        if (this.activeNavItem === next) return;

        if (this.activeNavItem) this.activeNavItem.node.classList.remove(this.settings.activeClassName);

        this.activeNavItem = next;
        if (!next) return;

        next.node.classList.add(this.settings.activeClassName);
    }
};

var init = function init(sel, opts) {
    var els = [].slice.call(document.querySelectorAll(sel + ' a'));

    if (!els.length) throw new Error('Scroll Spy cannot be initialised, no augmentable elements found');

    return Object.assign(Object.create(componentPrototype), {
        DOMElements: els,
        settings: Object.assign({}, defaults, opts)
    }).init();
};

var index = { init: init };

exports.default = index;;
}));
