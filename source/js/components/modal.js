/**
 * Seed-CSS Overlay Modal Window.
 * @author Rogerio Taques (rogerio.taques@gmail.com)
 * @see http://rogeriotaques.github.io/seed-css/
 * @version 1.0.0
 * @since 2017-07-13
 * @license MIT
 */

var modal = function() {
  'use strict';

  // Makes the overlay modal window works
  var html = document.querySelector('html');
  var modals = document.querySelectorAll('.modal');
  var modalTriggers = document.querySelectorAll('[role="modal"]');

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

            // Add the class that animates
            modal.classList.add('hidden');

            // After .65 seconds forces to 'hide' the component from DOM.
            setTimeout(function() {
              modal.style.display = 'none';
              html.style.overflow = '';
            }, 650);
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

          if (modal !== null) {
            modal.style.display = '';

            // Need to use this timeout to make the animation possible.
            setTimeout(function() {
              modal.classList.remove('hidden');
              html.style.overflow = 'hidden';
            }, 150);
          }
        }
      });
    });
  }
};

if (typeof module !== 'undefined') {
  module.exports = modal;
}
