/**
 * Seed-CSS Overlay Modal Window.
 * @author Rogerio Taques (hello@abtz.co)
 * @see https://github.com/AbtzLabs/seed-css
 * @version 1.1.0
 * @license MIT
 */

var modal = function(options) {
  'use strict';

  // Default settings
  var defaultOptions = {
    trigger: '[role="modal"]', // the element that triggers the modal
    delay: 200 // delaying time to open/close the modal (milliseconds)
  };

  options = Object.assign({}, defaultOptions, options);

  // Get elements
  var modals = document.querySelectorAll('.modal');
  var modalTriggers = document.querySelectorAll(options.trigger);

  var fnClose = function(modalObject) {
    if (!modalObject) {
      return;
    }

    // Get html object
    var html = document.querySelector('html');

    // Add the class that animates
    modalObject.classList.add('hidden');

    // After X seconds, forces to 'hide' the component from DOM.
    setTimeout(function() {
      modalObject.style.display = 'none';
      html.style.overflow = '';
    }, options.delay * 2);
  }; // fnClose

  var fnOpen = function(modalObject) {
    if (!modalObject) {
      return;
    }

    // Get html object
    var html = document.querySelector('html');

    modalObject.style.display = '';

    // Need to use this timeout to make the animation possible.
    setTimeout(function() {
      modalObject.classList.remove('hidden');
      html.style.overflow = 'hidden';
    }, options.delay);
  }; // fnOpen

  if (modals !== null) {
    modals.forEach(function(modal, i) {
      // Handle the dismiss buttons
      var dismissals = modal.querySelectorAll('[role="modal-dismiss"]');

      if (dismissals !== null) {
        dismissals.forEach(function(dismiss, j) {
          dismiss.addEventListener('click', function(evt) {
            if (evt) {
              evt.preventDefault();
            }

            fnClose(modal);
          });
        });
      }
    });
  }

  if (modalTriggers !== null) {
    modalTriggers.forEach(function(trigger, i) {
      trigger.addEventListener('click', function(evt) {
        if (evt) {
          evt.preventDefault();
        }

        var ref = trigger.getAttribute('data-modal-id');

        if (ref !== null) {
          var modal = document.querySelector('#' + ref);
          fnOpen(modal);
        }
      });
    });
  }

  return {
    show: function(selector) {
      selector = typeof selector !== 'undefined' ? selector : '#modal';
      fnOpen(document.querySelector(selector));
    },
    hide: function(selector) {
      selector = typeof selector !== 'undefined' ? selector : '#modal';
      fnClose(document.querySelector(selector));
    }
  };
};

if (typeof module !== 'undefined') {
  module.exports = modal;
}
