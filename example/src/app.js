import StormScrollSpy from './libs/storm-scroll-spy';

const onDOMContentLoadedTasks = [() => {
	StormScrollSpy.init('.js-scroll-spy');
}];
    
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', () => { onDOMContentLoadedTasks.forEach((fn) => fn()); });