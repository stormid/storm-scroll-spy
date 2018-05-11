import defaults from './lib/defaults';
import componentPrototype from './lib/component-prototype';
	
const init = (sel, opts) => {
	let els = (typeof sel === 'string') ? [].slice.call(document.querySelectorAll(sel + ' a')) : [].slice.call(sel);
	
	if(!els.length) throw new Error('Scroll Spy cannot be initialised, no augmentable elements found');

	return Object.assign(Object.create(componentPrototype), {
		DOMElements: els,
		settings: Object.assign({}, defaults, opts)
	}).init();
};

export default { init };