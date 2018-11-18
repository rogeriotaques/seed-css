/**!
 * Seed-CSS - Offset Canvas.
 * @author Rogerio Taques (hello@abtz.co)
 * @see https://github.com/AbtzLabs/seed-css
 * @version 2.0.0
 * @license MIT
 */

const seedOffsetCanvas = function() {
  'use strict';

  const fnToggle = (canvasID) => {
    let customEvent;

    const canvas = document.querySelector(`#${canvasID.replace(/^#/, '')}`);

    const trigger = document.querySelector(
      `[role="offset-canvas"][data-id="${canvasID.replace(/^#/, '')}"]`
    );

    if (canvas !== null) {
      canvas.classList.toggle('open');

      if (trigger !== null) {
        trigger.classList.toggle('triggered');
      } // if (trigger !== null)

      // Prevents scrolling the HTML
      if (canvas.classList.contains('open')) {
        document.querySelector('html').style.overflow = 'hidden';
      } else {
        document.querySelector('html').style.overflow = '';
      }

      // Wait until animation is complete to dispatch the event
      setTimeout(() => {
        if (canvas.classList.contains('open')) {
          customEvent = new CustomEvent('canvas.opened');
        } else {
          customEvent = new CustomEvent('canvas.closed');
        }

        // Dispatch the 'canvas.opened'/ 'canvas.closed' events
        canvas.dispatchEvent(customEvent);
      }, 300);
    } // if (canvas !== null)
  }; // fnToggle

  const fnTriggerClick = (evt) => {
    if (evt) {
      evt.preventDefault();
    }

    fnToggle(evt.currentTarget.getAttribute('data-id') || 'sidenav');
  }; // fnTriggerClick

  // Find all existing triggers
  const triggers = document.querySelectorAll('[role="offset-canvas"]');

  // Find all existing offset-canvas
  const canvases = document.querySelectorAll('.offset-canvas');

  if (triggers !== null) {
    triggers.forEach(function(trigger, i) {
      trigger.addEventListener('click', fnTriggerClick);
    }); // triggers.forEach(function(trigger, i)
  } // if (triggers !== null)

  if (canvases !== null) {
    canvases.forEach((canvas, i) => {
      // Attach method for opening
      canvas.open = () => {
        fnToggle(canvas.getAttribute('id') || 'sidenav');
      }; // open

      // Attach method for closing
      canvas.close = () => {}; // close
    }); // canvases.forEach((canvas, i)
  } // if (canvases !== null)

  return {
    get: (idx) => {
      if (typeof idx === 'string') {
        let canvas = false;

        canvases.forEach((node) => {
          if (node.id === idx.replace(/^#/, '')) {
            canvas = node;
            return;
          }
        });

        return canvas;
      }

      if (typeof canvas[idx] !== 'undefined') {
        return canvas[idx];
      }

      return false;
    }
  };
}; // seedOffsetCanvas

if (typeof module !== 'undefined') {
  if (typeof module.exports.SeedCSS === 'undefined') {
    module.exports.SeedCSS = {};
  }

  module.exports.SeedCSS.offsetCanvas = seedOffsetCanvas;
} else {
  if (typeof window.SeedCSS === 'undefined') {
    window.SeedCSS = {};
  }

  window.SeedCSS.offsetCanvas = seedOffsetCanvas;
}
