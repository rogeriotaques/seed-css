/** 
 * seed-css 
 * A light-weight, mobile first and responsive CSS boilerplate. 
 * @author Rogerio Taques (rogerio.taques@gmail.com) 
 * @copyright 2016-2018, Rogerio Taques (rogerio.taques@gmail.com) 
 * @license MIT 
 * @version 3.0.0 
 */ 

 /**!
 * A simple polyfill for CustomEvent
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
 */
(function() {
  if (typeof window.CustomEvent === 'function') return false;

  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(
      event,
      params.bubbles,
      params.cancelable,
      params.detail
    );
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

/**!
 * Seed-CSS - Custom HTML Input File.
 * @author Rogerio Taques (hello@abtz.co)
 * @see https://github.com/AbtzLabs/seed-css
 * @version 2.0.0
 * @license MIT
 */

const seedFileUpload = function() {
  'use strict';

  const fnChange = function fnChange(evt) {
    if (evt) {
      evt.preventDefault();
    }

    let customEvent;
    let fileName = false;

    const input = this;
    const label = input.nextElementSibling;

    // When multiple files are selected
    if (input.files && input.files.length > 1) {
      fileName = (
        input.getAttribute('data-multiple') || '{count} files'
      ).replace('{count}', input.files.length);
    }

    // When only one file is selected
    else if (input.value.trim().length > 0) {
      fileName = input.value.split('\\').pop();
    }

    if (fileName) {
      label.querySelector('.input').innerHTML = fileName;
    }

    if (input.value !== '') {
      customEvent = new CustomEvent('file.chosen');
      input.parentNode.classList.add('chosen');
      input.dispatchEvent(customEvent);
    }
  }; // fnChange

  // Find all seed-file inputs.
  const inputs = document.querySelectorAll('.seed-file > [type="file"]');

  if (inputs !== null) {
    inputs.forEach(function(input, i) {
      // Find the field label
      const label = input.nextElementSibling;
      const cancel = label.querySelector('.cancel');
      const emptyText = input.getAttribute('data-empty') || 'No file chosen';

      // If label does not exists, simply do not set it up
      if (!label) {
        return;
      }

      // Make sure input and label matches and works.
      if (
        input.getAttribute('id') &&
        input.getAttribute('id') !== label.getAttribute('for')
      ) {
        label.setAttribute('for', input.getAttribute('id'));
      } else if (label.getAttribute('for') && !input.getAttribute('id')) {
        input.setAttribute('id', label.getAttribute('for'));
      } else {
        input.setAttribute('id', 'file-input-' + i);
        label.setAttribute('for', 'file-input-' + i);
      }

      // Always the cancel button exists, adds a handler
      if (cancel) {
        cancel.addEventListener('click', (evt) => {
          if (evt) {
            evt.preventDefault();
          }

          const emptyText =
            input.getAttribute('data-empty') || 'No file chosen';

          input.value = '';
          input.parentNode.classList.remove('chosen');
          label.querySelector('.input').innerHTML = emptyText;

          const customEvent = new CustomEvent('file.removed');
          input.dispatchEvent(customEvent);
        });
      }

      label.querySelector('.input').innerHTML = emptyText;

      // Start listening the field for changes
      input.addEventListener('change', fnChange);
    }); // inputs.forEach(function(input, i)
  } // if (inputs !== null)
}; // seedFileUpload

if (typeof module !== 'undefined') {
  if (typeof module.exports.SeedCSS === 'undefined') {
    module.exports.SeedCSS = {};
  }

  module.exports.SeedCSS.fileUpload = seedFileUpload;
} else {
  if (typeof window.SeedCSS === 'undefined') {
    window.SeedCSS = {};
  }

  window.SeedCSS.fileUpload = seedFileUpload;
}

/**!
 * Seed-CSS - Modal
 * @author Rogerio Taques (hello@abtz.co)
 * @see https://github.com/AbtzLabs/seed-css
 * @version 2.0.0
 * @license MIT
 */

let fnOpen;

let fnClose;

let fnEsc;

const seedModal = (options) => {
  'use strict';

  // Default settings
  const defaultOptions = {
    // the element that triggers the modal
    trigger: '[role="modal"]',

    // @see: https://daneden.github.io/animate.css/
    // animate.css classes to be used
    classAnimation: {
      open: 'flipInX',
      close: 'flipOutX'
    }
  };

  options = Object.assign({}, defaultOptions, options);

  // Get elements
  let modals = document.querySelectorAll('.modal');
  let modalTriggers = document.querySelectorAll(options.trigger);

  fnClose = (modalObject) => {
    if (!modalObject) {
      return;
    }

    let customEvent;
    const html = document.querySelector('html');
    const mWin = modalObject.querySelector('.modal-window');

    if (!mWin) {
      return;
    }

    // Removes the ESC listener
    document.removeEventListener('keydown', fnEsc);

    // Replace open animation to close the modal window
    mWin.classList.replace(
      options.classAnimation.open,
      options.classAnimation.close
    );

    // Add animation to the overlay
    modalObject.classList.add('delay-1s');
    modalObject.classList.replace('fadeIn', 'fadeOut');

    // Wait 2 seconds before complete de process.
    // This is the time to finishing all animate.css animations
    setTimeout(() => {
      // Dispatch the 'modal.closed' event
      customEvent = new CustomEvent('modal.closed');
      modalObject.dispatchEvent(customEvent);

      // Completely hide the component
      modalObject.classList.add('hide');
      // Reenable scrolling from the HTML
      html.style.overflow = '';
      // Remove closing classes from overlay
      modalObject.classList.remove('delay-1s', 'fadeOut');
      // Remove closing classes from modal window
      mWin.classList.replace(
        options.classAnimation.close,
        options.classAnimation.open
      );
    }, 1500);
  }; // fnClose

  fnOpen = (modalObject) => {
    if (!modalObject) {
      return;
    }

    let customEvent;
    const html = document.querySelector('html');
    const mWin = modalObject.querySelector('.modal-window');

    // Handle the ESC dismiss
    fnEsc = function escHandler(e) {
      const key = e.keyCode || e.which;

      // When the ESC key is pressed
      if (key === 27) {
        fnClose(modalObject);
      }
    };

    if (!mWin) {
      return;
    }

    // Add (and remove) an ESC handler for the overlay
    document.addEventListener('keydown', fnEsc);

    // Clear inline display style, if any
    modalObject.style.display = '';
    // Add animation to the overlay
    modalObject.classList.add('animated', 'fadeIn', 'fast');
    // Add animation to the modal window
    mWin.classList.add('animated', options.classAnimation.open);
    // Show the component
    modalObject.classList.remove('hide');
    // Finally prevent scrolling
    html.style.overflow = 'hidden';

    // Wait the animation complete to dispatch the event
    // Each animate.css animation takes 1s
    setTimeout(() => {
      // Dispatch the 'modal.opened' event
      customEvent = new CustomEvent('modal.opened');
      modalObject.dispatchEvent(customEvent);
    }, 1000);
  }; // fnOpen

  if (modals !== null) {
    modals.forEach((modal, i) => {
      // Handle the dismiss buttons
      const dismissals = modal.querySelectorAll('[role="modal-dismiss"]');

      // Add (and remove) a click handler on the overlay
      modal.addEventListener('click', () => {
        fnClose(modal);
      });

      // Add prototype for show (open)
      modal.show = () => {
        fnOpen(modal);
      };

      // Add prototype for hide (clode)
      modal.hide = () => {
        fnClose(modal);
      };

      if (dismissals !== null) {
        dismissals.forEach((dismiss, j) => {
          dismiss.addEventListener('click', (evt) => {
            if (evt) {
              evt.preventDefault();
              evt.stopPropagation();
            }

            fnClose(modal);
          });
        });
      } // if (dismissals !== null)
    });
  } // if (modals !== null)

  if (modalTriggers !== null) {
    modalTriggers.forEach((trigger, i) => {
      trigger.addEventListener('click', (evt) => {
        if (evt) {
          evt.preventDefault();
        }

        const ref = trigger.getAttribute('data-modal-id');

        if (ref !== null) {
          const modal = document.querySelector(`#${ref}`);
          fnOpen(modal);
        }
      });
    });
  } // if (modalTriggers !== null)

  modalTriggers = undefined;

  return {
    get: (idx) => {
      if (typeof idx === 'string') {
        let modal = false;

        modals.forEach((node) => {
          if (node.id === idx.replace(/^#/, '')) {
            modal = node;
            return;
          }
        });

        return modal;
      }

      if (typeof modals[idx] !== 'undefined') {
        return modals[idx];
      }

      return false;
    }
  };
}; // seedModal

if (typeof module !== 'undefined') {
  if (typeof module.exports.SeedCSS === 'undefined') {
    module.exports.SeedCSS = {};
  }

  module.exports.SeedCSS.modal = seedModal;
} else {
  if (typeof window.SeedCSS === 'undefined') {
    window.SeedCSS = {};
  }

  window.SeedCSS.modal = seedModal;
}

/**!
 * Seed-CSS - Off-Canvas.
 * @author Rogerio Taques (hello@abtz.co)
 * @see https://github.com/AbtzLabs/seed-css
 * @version 2.0.0
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

/**!
 * Seed-CSS - Additional features for HTML Textareas.
 * @author Rogerio Taques (hello@abtz.co)
 * @see https://github.com/AbtzLabs/seed-css
 * @version 2.0.0
 * @license MIT
 */

const seedTextarea = function() {
  'use strict';

  // Find all seed-file inputs.
  const inputs = document.querySelectorAll('.field > textarea');

  if (inputs !== null) {
    inputs.forEach(function(input, i) {
      let maxLength = 0;

      const parent = input.parentNode;
      const counterLabel = parent.querySelector('[role="counter"]');
      const template =
        counterLabel.getAttribute('data-template') ||
        'Typed %a out of %b. Remaining %c.';

      const fnCalc = () => {
        const typed = input.value.replace(/[\n\r]/g, '').length;
        const remaining = maxLength - typed;
        const minLength = Math.floor(maxLength * 0.1);

        counterLabel.innerHTML = template
          .replace('%a', typed)
          .replace('%b', maxLength)
          .replace(
            '%c',
            remaining <= minLength
              ? `<span class="red" >${remaining}</span>`
              : remaining
          );
      };

      maxLength = input.getAttribute('maxlength');

      // Ignore if maxlength is not given
      if (!maxLength) {
        return;
      }

      // Make sure the limit is an integer
      maxLength = parseInt(maxLength);

      // Attach the handlers
      'keypress keydown keyup'.split(' ').forEach((evt) => {
        input.addEventListener(evt, fnCalc, true);
      });

      // Initialize the utility label
      fnCalc();
    }); // inputs.forEach(function(input, i)
  } // if (inputs !== null)
}; // seedTextarea

if (typeof module !== 'undefined') {
  if (typeof module.exports.SeedCSS === 'undefined') {
    module.exports.SeedCSS = {};
  }

  module.exports.SeedCSS.textArea = seedTextarea;
} else {
  if (typeof window.SeedCSS === 'undefined') {
    window.SeedCSS = {};
  }

  window.SeedCSS.textArea = seedTextarea;
}
