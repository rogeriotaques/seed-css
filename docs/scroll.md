# Seed CSS Helper - Scroll

This helper is a simple vanilla JS implementation, which helps you to implement
some boring features such as `scroll spy` and `smooth scrolling`.

## How to use

```js
// Import library
import SeedCSS from 'seed-css';

// Initialize
SeedCSS.scroll();

// Or initialize with custom options
SeedCSS.scroll({
  spyScrollContainer: 'nav',
  spyScroll: 'a.smooth',
  revealWhenVisible: '.reveal' // coming soon
});
```

## Events

Always a trigger is executed (e.g. when a link is clicked), once the
scrolling animation is complete, this helper will emit an event `scroll.complete` which can be intercepted with an `addEventListener`.

```js
document.addEventListener('scroll.complete', () => {
  console.log('Finished smooth scrolling');
});
```
