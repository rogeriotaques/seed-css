/**!
 * Seed-CSS - Off-Canvas.
 * @author Rogerio Taques (hello@abtz.co)
 * @see https://github.com/AbtzLabs/seed-css
 * @version 2.0.3
 * @license MIT
 */

const seedOffCanvas = function() {
  'use strict';

  const fnToggle = (canvasID, triggerElement) => {
    let customEvent;

    const canvas = document.querySelector(`#${canvasID.replace(/^#/, '')}`);

    const trigger =
      triggerElement ||
      document.querySelector(
        `[role="offcanvas"][data-id="${canvasID.replace(/^#/, '')}"]`
      );

    if (canvas !== null) {
      canvas.classList.toggle('open');

      // Prevents scrolling the HTML
      if (canvas.classList.contains('open')) {
        if (trigger !== null) {
          // Add the 'triggered' class to the element which has triggered the offcanvas.
          trigger.classList.add('triggered');
        } // if (trigger !== null)

        // Prevents main to scroll
        document.querySelector('html').style.overflow = 'hidden';
      } else {
        // Remove the 'triggered' class for any existing trigger which refers given offcanvas.
        document
          .querySelectorAll(
            `[role="offcanvas"][data-id="${canvasID.replace(/^#/, '')}"]`
          )
          .forEach((tgr) => {
            tgr.classList.remove('triggered');
          });

        // Re-enables main scrolling
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

    fnToggle(
      evt.currentTarget.getAttribute('data-id') || 'offcanvas',
      evt.currentTarget
    );
  }; // fnTriggerClick

  // Find all existing triggers
  const triggers = document.querySelectorAll('[role="offcanvas"]');

  // Find all existing offcanvas
  const canvases = document.querySelectorAll('.offcanvas');

  if (triggers !== null) {
    triggers.forEach(function(trigger, i) {
      trigger.addEventListener('click', fnTriggerClick);
    }); // triggers.forEach(function(trigger, i)
  } // if (triggers !== null)

  if (canvases !== null) {
    canvases.forEach((canvas, i) => {
      // Attach method for opening
      canvas.open = () => {
        fnToggle(canvas.getAttribute('id') || 'offcanvas');
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
}; // seedOffCanvas

if (typeof module !== 'undefined') {
  if (typeof module.exports.SeedCSS === 'undefined') {
    module.exports.SeedCSS = {};
  }

  module.exports.SeedCSS.offCanvas = seedOffCanvas;
} else {
  if (typeof window.SeedCSS === 'undefined') {
    window.SeedCSS = {};
  }

  window.SeedCSS.offCanvas = seedOffCanvas;
}
