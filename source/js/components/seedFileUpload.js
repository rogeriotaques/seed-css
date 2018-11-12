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

    let event;
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
      event = new CustomEvent('modal.opened');
      input.parentNode.classList.add('chosen');
      input.dispatchEvent(event);
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
        });
      }

      label.querySelector('.input').innerHTML = emptyText;

      // Start listening the field for changes
      input.addEventListener('change', fnChange); // input.addEventListener('change')
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
