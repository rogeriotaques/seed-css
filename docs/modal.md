# Seed CSS Helper - Modal

This helper is a simple vanilla JS implementation, which helps you to make
the overlay modal windows work, also setting up handler for closing the
window on a click outside the boudaries or just pressing the ESC key.

## How to use

```js
// Import library
import { seedModal } from 'seed-css';

// Initialize
seedModal();

// Or initialize with custom options
seedModal({
  // the element that triggers the modal
  trigger: '[role="modal"]',

  // @see: https://daneden.github.io/animate.css/
  // animate.css classes to be used
  classAnimation: {
    open: 'bounceInDown',
    close: 'bounceOutUp'
  }
});
```

## Animation

Seed CSS already imports the Animate CSS library, and you can
make use of any available animation class to animate the modal
transitions. Please check the options at:

[https://daneden.github.io/animate.css/](https://daneden.github.io/animate.css/)

## Events

This helper will also dispatch events when it is opened (`modal.opened`) or closed (`modal.closed`). Here is an exemplo on how to implement it:

```js
const m = seedModal(); // Init the modal helper
const modal = m.get('#modal'); // Gets the right modal

if (modal) {
  modal.addEventListener('modal.opened', () => {
    console.log('Modal Opened');
  });

  modal.addEventListener('modal.closed', () => {
    console.log('Modal Closed');
  });
}
```
