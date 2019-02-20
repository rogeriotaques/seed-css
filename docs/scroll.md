# Seed CSS Helper - Scroll

This helper is a simple vanilla JS implementation, which helps you to implement
some boring features such as `scroll spy` and `smooth scrolling`.

## How to use

```js
// Import library
import { seedScroll } from 'seed-css';

// Initialize
seedScroll();

// Or initialize with custom options
seedScroll({
  spyScrollSelector: 'nav a.smooth',
  revealElementSelector: '.reveal',
  revealSpaceOffset: 0.2,
  revealWhenVisible: 'visible',
  revealSingleAnimation: 'visible-once',
  revealWhenHidden: 'hidden',
  gutter: 50 
});
```

### Options

| Property              | Default Value  | Description                                                                 |
| --------------------- | -------------- | --------------------------------------------------------------------------- |
| spyScrollSelector     | `nav a.smooth` | Class to be watched for smooth scrolling and spy updated                    |
| revealElementSelector | `.reveal`      | Class to be watched for elements getting inside the viewport                |
| revealSpaceOffset     | `0.2`          | Defines the gutter used when checking if an element got inside the viewport |
| revealSingleAnimation | `visible-once` | When present, the element is not hidden when gets outside the viewport      |
| revealWhenVisible     | `visible`      | Class used then the element gets inside the view port                       |
| revealWhenHidden      | `hidden`       | Class used when the element gets outside the viewport                        |
| gutter                | `50`           | How many pixels will be added to the elem offset top                     |

## Events

Always a trigger is executed (e.g. when a link is clicked), once the
scrolling animation is complete, this helper will emit an event `scroll.complete` which can be intercepted with an `addEventListener`.

```js
document.addEventListener('scroll.complete', () => {
  console.log('Finished smooth scrolling');
});
```
