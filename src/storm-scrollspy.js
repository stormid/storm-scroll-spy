(function(root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.StormScrollSpy = factory();
  }
}(this, function() {
	'use strict';
    
    var instances = [],
        docHeight = null,
        isHidden = function (el) {
            return (el.offsetParent === null);
        },
        inView = function (el) {
            if (isHidden(el)) {
                return false;
            }
            var view = {
                    l: 0,
                    t: 0,
                    b: (window.innerHeight || document.documentElement.clientHeight),
                    r: (window.innerWidth || document.documentElement.clientWidth)
                },
                box = el.getBoundingClientRect();
            return (box.right >= view.l && box.bottom >= view.t && box.left <= view.r && box.top <= view.b);
        },
        defaults = {
            offset: 0,
            activeClassName: 'active',
            callback: null
        },
        StormScrollSpy = {
            init: function() {
                this.navItems = this.getNavItems();
                this.setPositions();
                this.sortNavItems();
                this.setInitialActiveItem();
                this.setCurrentItem();
                this.initListeners();
                return this;
            },
            initListeners: function(){
                this.throttledScroll = STORM.UTILS.throttle(function(){
                    this.setCurrentItem();
                }.bind(this), 16);
                
                this.throttledResize = STORM.UTILS.throttle(function(){
                    this.setPositions();
                    this.setCurrentItem();
                }.bind(this), 16);

                window.addEventListener('scroll', this.throttledScroll, false);
                window.addEventListener('scroll', this.throttledResize, false);
            },
            getNavItems: function(){
                return this.DOMElements.map(function(item) {
                    if (!item.hash || !document.querySelector(item.hash)) return;
                    
                    return {
                        node: item,
                        target: document.querySelector(item.hash),
                        parent: item.parentNode.tagName.toLowerCase() === 'li' ? item.parentNode : null,
                        position: 0
                    };
                });
            },
            setPositions: function(){
                var getOffsetTop = function (el) {
                        var location = 0;
                        if (el.offsetParent) {
                            do {
                                location += el.offsetTop;
                                el = el.offsetParent;
                            } while (el);
                        } else {
                            location = el.offsetTop;
                        }
                        location = location - this.settings.offset;
                        return location >= 0 ? location : 0;
                    }.bind(this);

                docHeight = Math.max(
                    document.body.scrollHeight, document.documentElement.scrollHeight,
                    document.body.offsetHeight, document.documentElement.offsetHeight,
                    document.body.clientHeight, document.documentElement.clientHeight
                );
                this.navItems.forEach(function(item) {
                    item.position = getOffsetTop(item.target);
                });
            },
            sortNavItems: function(){
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
            setInitialActiveItem: function(){
                this.activeNavItem = this.navItems.filter(function(item){
                    return item.node.classList.contains(this.settings.activeClassName);
                }.bind(this))[0] || null;
            },
            setCurrentItem: function(){
		        var position = window.pageYOffset;

                //at the bottom and in view, choose the last one
                if ((window.innerHeight + position) >= docHeight && !!inView(this.navItems[0].node) ) {
                    this.toggle(this.navItems[0]);
                    return this;
                }
                //find the next item
                for(var i = 0; i < this.navItems.length; i++){
                    if(this.navItems[i].position <= position) {
                        this.toggle(this.navItems[i]);
                        return this;
                    }
                }
                //nothing found
                this.toggle(null);
                !!this.settings.callback && this.settings.callback();
            },
            toggle: function(next){
                if(this.activeNavItem === next) { return;}
                if(!!this.activeNavItem) {
                    this.activeNavItem.node.classList.remove(this.settings.activeClassName);
                }
                this.activeNavItem = next;
                if(!next){ return; }
                next.node.classList.add(this.settings.activeClassName);
            }
        };
    
    function init(sel, opts) {
        var els = [].slice.call(document.querySelectorAll(sel + ' a'));
        
        if(els.length === 0) {
            throw new Error('Scrollspy cannot be initialised, no augmentable elements found');
        }
        return Object.assign(Object.create(StormScrollSpy), {
            DOMElements: els,
            settings: Object.assign({}, defaults, opts)
        }).init();
    }
    
    function destroy() {
        instances.forEach(function(instance){
            instance.destroy();
        });
        instance = [];
    }
	return {
		init: init,
        destroy: destroy
	};
	
 }));