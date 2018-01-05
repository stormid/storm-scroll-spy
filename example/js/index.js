/**
 * @name storm-scroll-spy: Automated scroll position-related navigation state management
 * @version 1.0.2: Fri, 09 Jun 2017 10:41:45 GMT
 * @author mjbp
 * @license MIT
 */
import defaults from './lib/defaults';
import componentPrototype from './lib/component-prototype';
	
const init = (sel, opts) => {
	let els = [].slice.call(document.querySelectorAll(sel + ' a'));
	
	if(!els.length) throw new Error('Scroll Spy cannot be initialised, no augmentable elements found');

	return Object.assign(Object.create(componentPrototype), {
		DOMElements: els,
		settings: Object.assign({}, defaults, el.dataset, opts)
	}).init();
};

export default { init };