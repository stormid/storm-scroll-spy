/**
 * @name storm-scroll-spy: Automated scroll position-related navigation state management
 * @version 1.1.1: Fri, 09 Mar 2018 15:00:02 GMT
 * @author stormid
 * @license MIT
 */
import defaults from './lib/defaults';
import componentPrototype from './lib/component-prototype';
	
const init = (sel, opts) => {
	let els = [].slice.call(document.querySelectorAll(sel + ' a'));
	
	if(!els.length) throw new Error('Scroll Spy cannot be initialised, no augmentable elements found');

	return Object.assign(Object.create(componentPrototype), {
		DOMElements: els,
		settings: Object.assign({}, defaults, opts)
	}).init();
};

export default { init };