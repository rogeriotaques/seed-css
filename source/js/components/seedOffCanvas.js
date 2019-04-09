/**!
 * Seed-CSS - Off-Canvas.
 * @copyright 2019, Abtz Labs
 * @license MIT
 */

const seedOffCanvas = function() {
  'use strict';
  const openedOffcanvasClass = 'canvas-opened';

  const fnOutsideClickHandler = function(ev) {
    let a = ev.target;
    let found = false;
    const html = document.querySelector('html');

    while (!found) {
      if (!a || !a.parentNode) {
        // It seems we've reached the root (html)
        break;
      }

      if (a.classList && !a.classList.contains('offcanvas')) {
        // Neither found .canvas nor the root level
        a = a.parentNode;
      } else if (a.classList) {
        found = true;
      }
    }

    if (!found && html.classList.contains(openedOffcanvasClass)) {
      // It seems has happened an outsider click
      fnToggle(html.getAttribute('data-canvas-id'));
    }
  };

  const fnToggle = (canvasID, triggerElement) => {
    let customEvent;

    const canvas = document.querySelector(`#${canvasID.replace(/^#/, '')}`);

    const trigger =
      triggerElement ||
      document.querySelector(
        `[role="offcanvas"][data-id="${canvasID.replace(/^#/, '')}"]`
      );

    if (canvas !== null) {
      const html = document.querySelector('html');

      if (!html.classList.contains(openedOffcanvasClass)) {
        canvas.classList.add('open');

        if (trigger !== null) {
          // Add the 'triggered' class to the element which has triggered the offcanvas.
          trigger.classList.add('triggered');
        } // if (trigger !== null)

        // Prevents main to scroll
        html.addEventListener('click', fnOutsideClickHandler);
        html.style.overflow = 'hidden';
      } else {
        canvas.classList.remove('open');

        // Remove the 'triggered' class for any existing trigger which refers given offcanvas.
        document
          .querySelectorAll(
            `[role="offcanvas"][data-id="${canvasID.replace(/^#/, '')}"]`
          )
          .forEach((tgr) => {
            tgr.classList.remove('triggered');
          });

        // Re-enables main scrolling
        html.removeEventListener('click', fnOutsideClickHandler);
        html.style.overflow = '';
      }

      // Wait until animation is complete to dispatch the event
      setTimeout(() => {
        if (canvas.classList.contains('open')) {
          html.classList.add(openedOffcanvasClass);
          html.setAttribute('data-canvas-id', canvasID.replace(/^#/, ''));
          customEvent = new CustomEvent('canvas.opened');
        } else {
          html.classList.remove(openedOffcanvasClass);
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
  module.exports.seedOffCanvas = seedOffCanvas;
}

// Expose SeedCSS in the global scope
if (typeof window.SeedCSS === 'undefined') {
  window.SeedCSS = {};
}

// Expose offcanvas menu in the global scope
window.SeedCSS.offCanvas = seedOffCanvas;
