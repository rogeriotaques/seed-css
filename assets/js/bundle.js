;(function ($) {

  var navbar, iniPos, limitPos, curPos, navWidth, edge = 20;

  $(document)

    .on('ready', function () {

      navbar = $('#samples-nav');
      iniPos = navbar.offset().top;
      limitPos = $('#license').offset().top - edge;
      curPos = $(this).scrollTop() + edge;
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
        if ( curPos + navbar.height() >= limitPos ) {
          console.log('bigger', curPos + navbar.height(), limitPos);
          curPos -= (curPos + navbar.height() - limitPos );
        }

        navbar
          .addClass('stacked')
          .css({
            width: navWidth,
            top: Math.fround( curPos - iniPos )
          });
      }

    })

    .on('scroll resize', function () {
      curPos = $(this).scrollTop() + edge;

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
      $.get('https://img.shields.io/github/release/rogeriotaques/seed-css.json', function (data) {
        $('#release').html( data.value );
      });

    });

}(jQuery));
