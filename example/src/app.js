import Load from 'storm-load';
import Tabs from 'storm-tabs';

const onDOMContentLoadedTasks = [() => {

	Load('./js/storm-scroll-spy.standalone.js')
		.then(() => {
			StormScrollSpy.init('.js-scroll-spy');
			Tabs.init('.js-tabs');
		});
}];
    
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', () => { onDOMContentLoadedTasks.forEach((fn) => fn()); });