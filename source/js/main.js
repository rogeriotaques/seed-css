/**
 * Seed-CSS - Landing Page.
 * @author Rogerio Taques (hello@abtz.co)
 * @see https://github.com/AbtzLabs/seed-css
 * @version 2.0.0
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

        const row = $('#flexible-cols');
        const cols = row.find('.col');

        if (cols.length > 1) {
          const remain = cols.length - 1;
          const lastClass = 'sm-' + (12 - remain + 1);

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

  // Init grid playground
  enableGridPlayground();

  // Init the modal
  SeedCSS.modal();
})();

// (function($) {
//   'use strict';

//   var gutter = 50;

//   /**
//    * Enables the hero effect.
//    */
//   var enableHero = function() {
//     $(window).on('scroll', function() {
//       var scroll = $(window).scrollTop();

//       $('header').css({
//         'background-size': 100 + scroll / 20 + '% ' + (100 + scroll / 20) + '%'
//       });
//     });
//   };

//   /**
//    * Enables the scroll spy which highlights the menu item
//    * as soon as the user scrolls on its content position.
//    */
//   var enableScrollSpy = function() {
//     // Define the initial position for all navs.
//     $('.samples-nav').each(function(i, el) {
//       var _this = $(el);
//       var ref = $(_this.data('attach'));

//       _this.data({
//         width: _this.width(),
//         start: ref.offset().top - (gutter + i * 10)
//       });
//     });

//     $(window)
//       // Makes side nav scrolling together to the screen.
//       .on('scroll', function() {
//         $('.samples-nav').each(function(i, el) {
//           var _this = $(el);
//           var start = _this.data('start');
//           var limit = $(_this.data('limit')).offset().top - gutter;
//           var scroll = $(window).scrollTop();

//           if (scroll + gutter >= _this.data('start')) {
//             if (!_this.hasClass('stacked')) {
//               _this.addClass('stacked');
//             }

//             if (scroll + _this.height() < limit) {
//               _this.css({
//                 width: _this.data('width'),
//                 top: Math.fround(scroll - _this.data('start') + gutter)
//               });
//             } else if (
//               scroll < _this.data('start') &&
//               _this.hasClass('stacked')
//             ) {
//               _this.removeClass('stacked');
//               _this.css({
//                 top: '',
//                 width: ''
//               });
//             }
//           }
//         });
//       })
//       // Makes the side nav items highlithed when scroll into its content
//       .on('scroll resize', function() {
//         var scroll = $(window).scrollTop();

//         $('.spy')
//           .not('.ignore')
//           .each(function(i, el) {
//             var _el = $(el);
//             var ref = $(_el.attr('href'));

//             if (
//               ref.offset() !== undefined &&
//               scroll >= ref.offset().top - gutter &&
//               scroll < ref.offset().top + ref.height() - gutter
//             ) {
//               $('.spy.active').removeClass('active');
//               _el.addClass('active');
//               return false;
//             }
//           });
//       });

//     // Smooth the scrolling when user clicks on any item from side nav.
//     $('.spy').each(function(i, el) {
//       var _el = $(el);

//       _el.on('click', function(evt) {
//         var ref = $(_el.attr('href'));

//         $('html, body').animate(
//           {
//             scrollTop: ref.offset().top - gutter + 20
//           },
//           400
//         );
//       });
//     });
//   };

//   enableHero();
//   enableScrollSpy();
//   enableGridPlayground();

//   // Setup fileUpload
//   if (typeof fileUpload !== 'undefined') {
//     fileUpload();
//   }

//   // Setup modal
//   if (typeof modal !== 'undefined') {
//     modal();
//   }

//   // get version shield from github/shilds.io
//   // @deprecated
//   // $.get('https://img.shields.io/github/release/rogeriotaques/seed-css.json', function (data) {
//   //   $('#release').html( data.value );
//   // });
//   // });
// })(jQuery);
