;(function ($) {

  var navbar, clone, iniPos;

  $(document)

    .on('ready', function () {
      navbar = $('section.page-navbar');
      iniPos = navbar.offset().top;
      clone  = navbar.clone();

      clone.addClass('stacked');

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
      if ($(this).scrollTop() >= iniPos && $('.page-navbar.stacked').length === 0) {
        navbar.after(clone).css({'visibility': 0});
      }

    })

    .on('scroll', function () {

      // handler for navbar stacked
      if ($(this).scrollTop() >= iniPos && $('.page-navbar.stacked').length === 0) {
        navbar.after(clone).css({'visibility': 0});
      } else if ($(this).scrollTop() < iniPos)  {
        navbar.css({'visibility': 1});
        clone.remove();
      }

    });

}(jQuery));
