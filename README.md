#Storm ScrollSpy

##Usage
```
npm i -S storm-scrollspy
```

```javascript
var ScrollSpy = require('storm-scrollspy')
ScrollSpy.init('.js-scrollspy');
```

```html
<nav class="js-scrollspy">
    <a href="#section1">Section 1</a>
    <a href="#section2">Section 2</a>
    <a href="#section3">Section 3</a>
</nav>
<section id="section1"></section>
<section id="section2"></section>
<section id="section3"></section>
```

###Options
Defaults:

```javascript
{
	offset: 0,
	activeClassName: 'active',
	callback: null
}
```

###Credits
Adapted from an initial fork of cferdinandi's gumshoe