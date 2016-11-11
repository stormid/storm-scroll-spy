import should from 'should';
import ScrollSpy from '../dist/storm-scroll-spy';
import 'jsdom-global/register';

const html = `<nav class="js-scroll-spy">
            <a href="#section1">Section 1</a>
            <a href="#section2">Section 2</a>
            <a href="#section3">Section 3</a>
        </nav><section id="section1" style="height:500px">
            Section 1
        </section>
        <section id="section2" style="height:500px">
            Section 2
        </section>
        <section id="section3" style="height:500px">
            Section 3
        </section><nav class="js-scroll-spy-2">
            <a href="#section1">Section 1</a>
            <a href="#section2">Section 2</a>
            <a href="#section3">Section 3</a>
        </nav><section id="section1" style="height:500px">
            Section 1
        </section>
        <section id="section2" style="height:500px">
            Section 2
        </section>
        <section id="section3" style="height:500px">
            Section 3
        </section>`;

document.body.innerHTML = html;

let ScrollSpy1 = ScrollSpy.init('.js-scroll-spy'),
	ScrollSpy2 = ScrollSpy.init('.js-scroll-spy-2', {
		offset: 10
	});

describe('Initialisation', () => {

	it('should return a scroll spy object', () => {
		should(ScrollSpy1)
		.Object();
	});

	
	it('should throw an error if no link elements are found', () => {
		ScrollSpy.init.bind(ScrollSpy, '.js-err').should.throw();
	});
	
	it('each array item should be an object with the correct properties', () => {
		
		ScrollSpy1.should.have.property('settings').Object();
		ScrollSpy1.should.have.property('init').Function();
		ScrollSpy1.should.have.property('initListeners').Function();
		ScrollSpy1.should.have.property('getNavItems').Function();
		ScrollSpy1.should.have.property('setPositions').Function();
		ScrollSpy1.should.have.property('sortNavItems').Function();
		ScrollSpy1.should.have.property('setInitialActiveItem').Function();
		ScrollSpy1.should.have.property('setCurrentItem').Function();
		ScrollSpy1.should.have.property('toggle').Function();
    
	});


	it('should initialisation with different settings if different options are passed', () => {
		should(ScrollSpy2.settings.offset).not.equal(ScrollSpy1.settings.offset);
	});
	

});