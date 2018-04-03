/**
 * Seed-CSS HTML Custom Input File.
 * @author Rogerio Taques (hello@abtz.co)
 * @see https://github.com/AbtzLabs/seed-css
 * @version 1.1.0
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
          fileName = (this.getAttribute('data-multiple-caption') || '').replace(
            '{count}',
            this.files.length
          );
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
  module.exports.fileUpload = fileUpload;
}
