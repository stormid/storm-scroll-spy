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

let ScrollSpySet = ScrollSpy.init('.js-scroll-spy'),
	ScrollSpySet2 = ScrollSpy.init('.js-scroll-spy2', {
		offset: 10
	});

describe('Initialisation', () => {

	it('should return array of tab accordions', () => {
		should(ScrollSpySet)
		.Array()
		.and.have.lengthOf(1);
	});

	
	it('should throw an error if no link elements are found', () => {
		ScrollSpy.init.bind(ScrollSpy, '.js-err').should.throw();
	});
	
	it('each array item should be an object with the correct properties', () => {
		ScrollSpySet[0].should.be.an.instanceOf(Object).and.not.empty();
		ScrollSpySet[0].should.have.property('settings').Object();
		ScrollSpySet[0].should.have.property('init').Function();
		ScrollSpySet[0].should.have.property('initListeners').Function();
		ScrollSpySet[0].should.have.property('getNavItems').Function();
		ScrollSpySet[0].should.have.property('setPositions').Function();
		ScrollSpySet[0].should.have.property('sortNavItems').Function();
		ScrollSpySet[0].should.have.property('setInitialActiveItem').Function();
		ScrollSpySet[0].should.have.property('setCurrentItem').Function();
		ScrollSpySet[0].should.have.property('toggle').Function();
    
	});


	it('should initialisation with different settings if different options are passed', () => {
		should(ScrollSpySet2[0].settings.offset).not.equal(ScrollSpySet[0].settings.offset);
	});
	

});