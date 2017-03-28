;(function ($) {

  var navbar, iniPos, limitPos, curPos, navWidth, gutter = 20;

  $(document)

    .on('ready', function () {

      navbar   = $('#samples-nav');
      iniPos   = navbar.offset().top;
      limitPos = $('#license').offset().top;
      curPos   = $(this).scrollTop();
      navWidth = navbar.width();

      // handler for smooth scrolling
      navbar
        .find('a.spy')
          .each(function () {
            var target = $( $(this).attr('href') );
            $(this).data('offset', target.offset().top + target.height());
          })
          .on('click', function (ev) {
            $('html,body').animate({scrollTop: $($(this).attr('href')).offset().top});
          });

      // when page is reloaded and it doesn't start on very top
      // just attach the 'stacked' class to navbar to assure it will be
      // available even on the middle of page.
      if (curPos >= iniPos && $('#samples-nav.stacked').length === 0) {
        if ( curPos + navbar.height() >= limitPos - 20 ) {
          curPos -= (curPos + navbar.height() - limitPos + 20 );
        }

        navbar
          .addClass('stacked')
          .css({
            width: navWidth,
            top: Math.fround( curPos - iniPos ) + 20
          });
      }

      // Set handler for users play with columns
      $('#add-col')
        .off('click')
        .on('click', function (evt) {
          if (evt) {
            evt.preventDefault();
          }

          var row  = $('#flexible-cols');
          var cols = row.find('.col');

          if ( cols.length < 12 ) {
            var count  = cols.length;
            var remain = 12 - count;
            var lastClass = 'sm-' + remain;

            row.find('.col').removeClass('sm-1 sm-2 sm-3 sm-4 sm-5 sm-6 sm-7 sm-8 sm-9 sm-10 sm-11 sm-12');
            row.find('.col:last').after( $('<div />', {'class': 'col align-center'}).html( count + 1 ) );
            row.find('.col').each(function () {
              $(this).addClass('sm-1');
            });
            row.find('.col:last').toggleClass('sm-1 ' + lastClass);

            $('#rem-col').attr('disabled', false);
          }
          
          if (cols.length >= 11) {
            $(this).attr('disabled', true);
          }
        });

      $('#rem-col')
        .off('click')
        .on('click', function (evt) {
          if (evt) {
            evt.preventDefault();
          }

          var row  = $('#flexible-cols');
          var cols = row.find('.col');

          if ( cols.length > 1 ) {
            var remain = cols.length - 1;
            var lastClass = 'sm-' + (12 - remain + 1);

            row.find('.col:last').remove();
            row.find('.col:last')
              .removeClass('sm-1 sm-2 sm-3 sm-4 sm-5 sm-6 sm-7 sm-8 sm-9 sm-10 sm-11 sm-12')
              .addClass(lastClass);

            $('#add-col').attr('disabled', false);
          } 
          
          if (cols.length <= 2) {
            $(this).attr('disabled', true);
          }
        });

    })

    .on('scroll resize', function () {
      curPos = $(this).scrollTop() + gutter;

      // handler for navbar stacked
      if (curPos >= iniPos && (curPos + navbar.height()) <= limitPos) {
        navbar
          .addClass('stacked')
          .css({
            width: navWidth,
            top: Math.fround( curPos - iniPos )
          });
      } else if (curPos < iniPos)  {
        navbar.removeClass('stacked').css({});
      }

      $('.spy')
        .removeClass('active')
        .each(function () {
          if (curPos < $(this).data('offset')) {
            $(this).addClass('active');
            return false;
          }
        });

      // get version shield from github/shilds.io
      // $.get('https://img.shields.io/github/release/rogeriotaques/seed-css.json', function (data) {
      //   $('#release').html( data.value );
      // });

    });

  // Makes possible the blur on heaader while scrolling.
  $(window).on('scroll', function() {
    var scroll = $(this).scrollTop();

    $("header").css({
      'background-size': (100 + scroll/20) + "% " + (100 + scroll/20) + "%",
    });
  });

}(jQuery));
