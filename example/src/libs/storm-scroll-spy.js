/**
 * @name storm-scroll-spy: Automated scroll position related navigation state management
 * @version 0.1.3: Fri, 10 Feb 2017 17:13:09 GMT
 * @author mjbp
 * @license MIT
 */
import throttle from 'lodash.throttle';


let docHeight = null;

const isHidden = el => {
		return (el.offsetParent === null);
	},
	inView = el => {
		if (isHidden(el)) return false;
		
		let view = {
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
		init() {
			this.navItems = this.getNavItems();
			this.setPositions();
			this.sortNavItems();
			this.setInitialActiveItem();
			this.setCurrentItem();
			this.initListeners();
			return this;
		},
		initListeners() {
			this.throttledScroll = throttle(function(){
				this.setCurrentItem();
			}.bind(this), 16);
			
			this.throttledResize = throttle(function(){
				this.setPositions();
				this.setCurrentItem();
			}.bind(this), 16);

			window.addEventListener('scroll', this.throttledScroll, false);
			window.addEventListener('scroll', this.throttledResize, false);
		},
		getNavItems() {
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
		setPositions() {
			let getOffsetTop = el => {
				let location = 0;
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
			};

			docHeight = Math.max(
				document.body.scrollHeight, document.documentElement.scrollHeight,
				document.body.offsetHeight, document.documentElement.offsetHeight,
				document.body.clientHeight, document.documentElement.clientHeight
			);
			this.navItems.forEach(item => {
				item.position = getOffsetTop(item.target);
			});
		},
		sortNavItems(){
			this.navItems.sort((a, b) => {
				if (a.position > b.position) {
					return -1;
				}
				if (a.position < b.position) {
					return 1;
				}
				return 0;
			});
		},
		setInitialActiveItem(){
			this.activeNavItem = this.navItems.filter(item => {
				return item.node.classList.contains(this.settings.activeClassName);
			})[0] || null;
		},
		setCurrentItem(){
			let position = window.pageYOffset;

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
		toggle(next){
			if(this.activeNavItem === next) return;

			if(this.activeNavItem) {
				this.activeNavItem.node.classList.remove(this.settings.activeClassName);
			}
			this.activeNavItem = next;
			if(!next) return;

			next.node.classList.add(this.settings.activeClassName);
		}
	};
	
const init = (sel, opts) => {
	let els = [].slice.call(document.querySelectorAll(sel + ' a'));
	
	if(!els.length) throw new Error('Scroll Spy cannot be initialised, no augmentable elements found');

	return Object.assign(Object.create(StormScrollSpy), {
		DOMElements: els,
		settings: Object.assign({}, defaults, opts)
	}).init();
};

export default { init };