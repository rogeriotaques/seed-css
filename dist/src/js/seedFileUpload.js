/**!
 * Seed-CSS - Custom HTML Input File.
 * @copyright 2019, Abtz Labs
 * @license MIT
 */

const seedFileUpload = function() {
  'use strict';

  let seedCustomEvent;

  const fnChange = function fnChange(evt) {
    if (evt) {
      evt.preventDefault();
    }

    let fileName = false;

    const input = this;
    const label = input.nextElementSibling;

    // When multiple files are selected
    if (input.files && input.files.length > 1) {
      fileName = (input.getAttribute('data-multiple') || '{count} files').replace('{count}', input.files.length);
    }

    // When only one file is selected
    else if (input.value.trim().length > 0) {
      fileName = input.value.split('\\').pop();
    }

    if (fileName) {
      label.querySelector('.input').innerHTML = fileName;
    }

    if (input.value !== '') {
      seedCustomEvent = new CustomEvent('file.chosen');
      input.parentNode.classList.add('chosen');
      input.dispatchEvent(seedCustomEvent);
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
      if (input.getAttribute('id') && input.getAttribute('id') !== label.getAttribute('for')) {
        label.setAttribute('for', input.getAttribute('id'));
      } else if (label.getAttribute('for') && !input.getAttribute('id')) {
        input.setAttribute('id', label.getAttribute('for'));
      } else if (!label.getAttribute('for') && !input.getAttribute('id')) {
        input.setAttribute('id', 'file-input-' + i);
        label.setAttribute('for', 'file-input-' + i);
      }

      // Always the cancel button exists, adds a handler
      if (cancel) {
        cancel.addEventListener('click', (evt) => {
          if (evt) {
            evt.preventDefault();
          }

          const emptyText = input.getAttribute('data-empty') || 'No file chosen';

          input.value = '';
          input.parentNode.classList.remove('chosen');
          label.querySelector('.input').innerHTML = emptyText;

          seedCustomEvent = new CustomEvent('file.removed');
          input.dispatchEvent(seedCustomEvent);
        });
      }

      label.querySelector('.input').innerHTML = emptyText;

      // Start listening the field for changes
      input.addEventListener('change', fnChange);
    }); // inputs.forEach(function(input, i)
  } // if (inputs !== null)

  return {
    get: (idx) => {
      if (typeof idx === 'string') {
        let fileUpload = false;

        inputs.forEach((node) => {
          if (node.id === idx.replace(/^#/, '')) {
            fileUpload = node;
            return;
          }
        });

        return fileUpload;
      }

      if (typeof inputs[idx] !== 'undefined') {
        return inputs[idx];
      }

      return false;
    }
  };
}; // seedFileUpload

if (typeof module !== 'undefined') {
  module.exports.fileUpload = fileUpload;
}

// Expose SeedCSS in the global scope
if (typeof window.SeedCSS === 'undefined') {
  window.SeedCSS = {};
}

// Expose fileUpload menu in the global scope
window.SeedCSS.fileUpload = seedFileUpload;
