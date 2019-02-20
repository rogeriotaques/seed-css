/**!
 * Seed-CSS - Modal
 * @author Rogerio Taques (hello@abtz.co)
 * @see https://github.com/AbtzLabs/seed-css
 * @version 2.2.0
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
      open: 'bounceInDown',
      close: 'bounceOutUp'
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
    }, 600);
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
    }, 100);
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
  module.exports.seedModal = seedModal;
} else {
  if (typeof window.SeedCSS === 'undefined') {
    window.SeedCSS = {};
  }

  window.SeedCSS.modal = seedModal;
}
