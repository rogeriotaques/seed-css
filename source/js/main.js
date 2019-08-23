/**
 * Seed-CSS - Landing Page.
 * @author Rogerio Taques
 * @see https://github.com/AbtzLabs/seed-css
 * @copyright 2019, Abtz Labs
 * @license private
 */

(() => {
  'use strict';

  /**
   * Enables the grid playground where user can add and remove
   * collumns in the sample page.
   */
  const enableGridPlayground = () => {
    // add columns
    $('#add-col')
      .off('click')
      .on('click', function(evt) {
        if (evt) {
          evt.preventDefault();
        }

        const row = $('#flexible-cols');
        const cols = row.find('.col');

        if (cols.length < 12) {
          const count = cols.length;
          const remain = 12 - count;
          const lastClass = 'sm-' + remain;

          row.find('.col').removeClass('sm-1 sm-2 sm-3 sm-4 sm-5 sm-6 sm-7 sm-8 sm-9 sm-10 sm-11 sm-12');

          row.find('.col:last').after($('<div />', { class: 'col align-center' }).html(count + 1));

          row.find('.col').each(function() {
            $(this).addClass('sm-1');
          });

          row.find('.col:last').toggleClass('sm-1 ' + lastClass);

          $('#rem-col').attr('disabled', false);
        }

        if (cols.length >= 11) {
          $(this).attr('disabled', true);
        }
      });

    // remove columns
    $('#rem-col')
      .off('click')
      .on('click', function(evt) {
        if (evt) {
          evt.preventDefault();
        }

        const row = $('#flexible-cols');
        const cols = row.find('.col');

        if (cols.length > 1) {
          const remain = cols.length - 1;
          const lastClass = 'sm-' + (12 - remain + 1);

          row.find('.col:last').remove();

          row
            .find('.col:last')
            .removeClass('sm-1 sm-2 sm-3 sm-4 sm-5 sm-6 sm-7 sm-8 sm-9 sm-10 sm-11 sm-12')
            .addClass(lastClass);

          $('#add-col').attr('disabled', false);
        }

        if (cols.length <= 2) {
          $(this).attr('disabled', true);
        }
      });
  };

  // Init grid playground
  enableGridPlayground();

  if (typeof SeedCSS !== 'undefined') {
    const m = SeedCSS.modal(); // Init the modal helper
    const modal = m.get('#modal');
    const c = SeedCSS.offCanvas(); // Init the offCanvas helper
    const canvas = c.get('#sidenav');
    const fu = SeedCSS.fileUpload(); // Init the fileUpload helper
    const upload = fu.get('#file');

    // Defines a special initialization options for the scroll
    const scrollOptions = {
      spyScrollSelector: 'a.smooth',
      revealElementSelector: '.reveal.animated',
      revealSingleAnimation: 'animated-once',
      revealWhenVisible: 'bounceIn',
      revealWhenHidden: 'bounceOut',
      revealSpaceOffset: 2.5,
      gutter: 150
    };

    SeedCSS.textArea(); // Init the textArea helper
    SeedCSS.scroll(scrollOptions); // Init the scroll helper

    if (modal) {
      modal.addEventListener('modal.opened', () => {
        console.log('Modal Opened');
      });

      modal.addEventListener('modal.closed', () => {
        console.log('Modal Closed');
      });
    }

    if (canvas) {
      let canvasStyleSwitcher = document.querySelector('#offcanvas-style');

      if (canvasStyleSwitcher) {
        canvasStyleSwitcher.addEventListener('change', () => {
          if (canvasStyleSwitcher.value === 'overlay') {
            canvas.classList.add('overlay');
          } else {
            canvas.classList.remove('overlay');
          }
        });
      }

      canvas.addEventListener('canvas.opened', () => {
        console.log('Side Menu Opened');
      });

      canvas.addEventListener('canvas.closed', () => {
        console.log('Side Menu Closed');
      });

      document.addEventListener('scroll.complete', () => {
        console.log('Finished smooth scrolling');
      });
    }

    if (upload) {
      upload.addEventListener('file.chosen', (evt) => {
        console.log('File(s) added to FileUpload.');

        const error = evt.currentTarget.parentNode.querySelector('span.error');

        // Add the success feedback classes
        evt.currentTarget.parentNode.classList.add('has-feedback');
        evt.currentTarget.classList.add('success');

        // Make sure no errors are displayed
        evt.currentTarget.classList.remove('error');

        if (error) {
          error.remove();
        }
      });

      upload.addEventListener('file.removed', (evt) => {
        console.log('File(s) removed from FileUpload.');

        const lbl = document.createElement('span');
        const error = evt.currentTarget.parentNode.querySelector('span.error');

        lbl.classList.add('error');
        lbl.innerHTML = 'Select at least one file.';

        // Add the error feedback classes
        evt.currentTarget.parentNode.classList.add('has-feedback');
        evt.currentTarget.classList.add('error');

        // Make sure it displayes the error label
        evt.currentTarget.classList.remove('success');

        if (!error) {
          evt.currentTarget.parentNode.appendChild(lbl);
        }
      });
    }
  }
})();
