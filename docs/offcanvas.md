# Seed CSS Helper - Off Canvas

This helper is a simple vanilla JS implementation, which helps you to make a off-canvas panel work smoothly and improve the user experience on your website.

## How to use

```js
// Import library
import { seedOffCanvas } from 'seed-css';

// Initialize
seedOffCanvas();
```

## Events

This helper will also dispatch events when it is opened (`canvas.opened`) or closed (`canvas.closed`). Here is an exemple on how to implement it:

```js
const m = seedOffCanvas(); // Init the modal helper
const canvas = c.get('#sidenav'); // Gets the right canvas

if (canvas) {
  canvas.addEventListener('canvas.opened', () => {
    console.log('Side Menu Opened');
  });

  canvas.addEventListener('canvas.closed', () => {
    console.log('Side Menu Closed');
  });
}
```
