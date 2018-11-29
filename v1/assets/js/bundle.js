/**
 * Seed-CSS HTML Custom Input File.
 * @author Rogerio Taques (hello@abtz.co)
 * @see https://github.com/AbtzLabs/seed-css
 * @version 1.2.4
 * @license MIT
 */

var fileUpload = function() {
  'use strict';

  // Selects all seed-file inputs.
  var inputs = document.querySelectorAll('.seed-file > [type="file"]');

  if (inputs !== null) {
    inputs.forEach(function(input, i) {
      var label = input.nextElementSibling;

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

/**
 * Seed-CSS Overlay Modal Window.
 * @author Rogerio Taques (hello@abtz.co)
 * @see https://github.com/AbtzLabs/seed-css
 * @version 1.2.4
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
  module.exports.modal = modal;
}

/**
 * Seed-CSS Landing Page.
 * @author Rogerio Taques (hello@abtz.co)
 * @see https://github.com/AbtzLabs/seed-css
 * @version 1.2.4
 * @license private
 */

(function($) {
  'use strict';

  var gutter = 50;

  /**
   * Enables the hero effect.
   */
  var enableHero = function() {
    $(window).on('scroll', function() {
      var scroll = $(window).scrollTop();

      $('header').css({
        'background-size': 100 + scroll / 20 + '% ' + (100 + scroll / 20) + '%'
      });
    });
  };

  /**
   * Enables the scroll spy which highlights the menu item
   * as soon as the user scrolls on its content position.
   */
  var enableScrollSpy = function() {
    // Define the initial position for all navs.
    $('.samples-nav').each(function(i, el) {
      var _this = $(el);
      var ref = $(_this.data('attach'));

      _this.data({
        width: _this.width(),
        start: ref.offset().top - (gutter + i * 10)
      });
    });

    $(window)
      // Makes side nav scrolling together to the screen.
      .on('scroll', function() {
        $('.samples-nav').each(function(i, el) {
          var _this = $(el);
          var start = _this.data('start');
          var limit = $(_this.data('limit')).offset().top - gutter;
          var scroll = $(window).scrollTop();

          if (scroll + gutter >= _this.data('start')) {
            if (!_this.hasClass('stacked')) {
              _this.addClass('stacked');
            }

            if (scroll + _this.height() < limit) {
              _this.css({
                width: _this.data('width'),
                top: Math.fround(scroll - _this.data('start') + gutter)
              });
            } else if (
              scroll < _this.data('start') &&
              _this.hasClass('stacked')
            ) {
              _this.removeClass('stacked');
              _this.css({
                top: '',
                width: ''
              });
            }
          }
        });
      })
      // Makes the side nav items highlithed when scroll into its content
      .on('scroll resize', function() {
        var scroll = $(window).scrollTop();

        $('.spy')
          .not('.ignore')
          .each(function(i, el) {
            var _el = $(el);
            var ref = $(_el.attr('href'));

            if (
              ref.offset() !== undefined &&
              scroll >= ref.offset().top - gutter &&
              scroll < ref.offset().top + ref.height() - gutter
            ) {
              $('.spy.active').removeClass('active');
              _el.addClass('active');
              return false;
            }
          });
      });

    // Smooth the scrolling when user clicks on any item from side nav.
    $('.spy').each(function(i, el) {
      var _el = $(el);

      _el.on('click', function(evt) {
        var ref = $(_el.attr('href'));

        $('html, body').animate(
          {
            scrollTop: ref.offset().top - gutter + 20
          },
          400
        );
      });
    });
  };

  /**
   * Enables the grid playground where user can add and remove
   * collumns in the sample page.
   */
  var enableGridPlayground = function() {
    // add columns
    $('#add-col')
      .off('click')
      .on('click', function(evt) {
        if (evt) {
          evt.preventDefault();
        }

        var row = $('#flexible-cols');
        var cols = row.find('.col');

        if (cols.length < 12) {
          var count = cols.length;
          var remain = 12 - count;
          var lastClass = 'sm-' + remain;

          row
            .find('.col')
            .removeClass(
              'sm-1 sm-2 sm-3 sm-4 sm-5 sm-6 sm-7 sm-8 sm-9 sm-10 sm-11 sm-12'
            );
          row
            .find('.col:last')
            .after($('<div />', { class: 'col align-center' }).html(count + 1));
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

        var row = $('#flexible-cols');
        var cols = row.find('.col');

        if (cols.length > 1) {
          var remain = cols.length - 1;
          var lastClass = 'sm-' + (12 - remain + 1);

          row.find('.col:last').remove();
          row
            .find('.col:last')
            .removeClass(
              'sm-1 sm-2 sm-3 sm-4 sm-5 sm-6 sm-7 sm-8 sm-9 sm-10 sm-11 sm-12'
            )
            .addClass(lastClass);

          $('#add-col').attr('disabled', false);
        }

        if (cols.length <= 2) {
          $(this).attr('disabled', true);
        }
      });
  };

  enableHero();
  enableScrollSpy();
  enableGridPlayground();

  // Setup fileUpload
  if (typeof fileUpload !== 'undefined') {
    fileUpload();
  }

  // Setup modal
  if (typeof modal !== 'undefined') {
    modal();
  }

  // get version shield from github/shilds.io
  // @deprecated
  // $.get('https://img.shields.io/github/release/rogeriotaques/seed-css.json', function (data) {
  //   $('#release').html( data.value );
  // });
  // });
})(jQuery);
