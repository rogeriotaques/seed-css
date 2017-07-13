/**
 * Seed-CSS HTML Custom Input File.
 * @author Rogerio Taques (rogerio.taques@gmail.com)
 * @see http://rogeriotaques.github.io/seed-css/
 * @version 1.0.0
 * @since 2017-07-13
 * @license MIT
 */

var fileUpload = function() {
  'use strict';

  // Selects all seed-file inputs.
  var inputs = document.querySelectorAll('.seed-file > [type="file"]');

  if (inputs !== null) {
    inputs.forEach(function(input, i) {
      var label = input.nextElementSibling;

      input.addEventListener('change', function(evt) {
        if (evt) {
          evt.preventDefault();
        }

        var fileName = false;

        if (this.files && this.files.length > 1) {
          fileName = (this.getAttribute('data-multiple-caption') || '')
            .replace('{count}', this.files.length);
        } else if (this.value.trim().length > 0) {
          fileName = this.value.split('\\').pop();
        }

        if (fileName) {
          label.querySelector('.input').innerHTML = fileName;
        }

        if (input.value !== '') {
          input.parentNode.classList.add('chosen');
        }
      });

      // label.querySelector('.cancel').addEventListener('click', function (evt) {
      //   if (evt) {
      //     evt.preventDefault();
      //   }

      //   input.value = '';
      //   input.parent.classList.remove('chosen');
      //   label.querySelector('.input').innerHTML = '';
      // });
    });
  }
};

if (typeof module !== 'undefined') {
  module.exports = fileUpload;
}

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
