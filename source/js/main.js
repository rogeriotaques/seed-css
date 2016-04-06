;(function ($) {

  var navbar, iniPos;

  $(document).on('ready', function () {
    navbar = $('section.page-navbar');
    iniPos = navbar.offset().top;

    // on click handler for smooth scrolling
    navbar
      .find('a.spy')
        .on('click', function (ev) {
          ev.preventDefault();
          $('html,body').animate({scrollTop: $($(this).attr('href')).offset().top - iniPos});
        });

  }).on('scroll', function () {

    // handler for navbar stacked 
    if ($(this).scrollTop() >= iniPos) {
      navbar.addClass('stacked');
    } else {
      navbar.removeClass('stacked');
    }

  });

}(jQuery));
