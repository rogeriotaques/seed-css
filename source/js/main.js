;(function ($) {

  var navbar, iniPos;

  $(document)

    .on('ready', function () {
      navbar = $('section.page-navbar');
      iniPos = navbar.offset().top;

      // handler for smooth scrolling
      navbar
        .find('a.spy')
          .on('click', function (ev) {
            ev.preventDefault();
            $('html,body').animate({scrollTop: $($(this).attr('href')).offset().top - iniPos});
          });

      // when page is reloaded and it doesn't start on very top
      // just attach the 'stacked' class to navbar to assure it will be
      // available even on the middle of page.
      if ($(this).scrollTop() > iniPos) {
        navbar.addClass('stacked');
      }

    })

    .on('scroll', function () {

      // handler for navbar stacked
      if ($(this).scrollTop() >= iniPos) {
        navbar.addClass('stacked');
      } else {
        navbar.removeClass('stacked');
      }

    });

}(jQuery));
