import Load from 'storm-load';

const onDOMContentLoadedTasks = [() => {

	Load('./js/storm-scroll-spy.standalone.js')
		.then(() => {
			StormScrollSpy.init('.js-scroll-spy');
		});
}];
    
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', () => { onDOMContentLoadedTasks.forEach((fn) => fn()); });