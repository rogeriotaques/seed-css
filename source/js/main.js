;(function ($) {

  // var navbars, iniPos, limitPos, curPos, navWidth, gutter = 20;
  var gutter = 20;

  // all sample-nav
  $('.samples-nav').each(function (i, el) {
    var _this = $(el);
    var ref = $(_this.data('attach'));

    _this.data({
      width: _this.width(),
      start: ref.offset().top - (gutter + i * 10)
    });
  });


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

      console.log('cols', cols.length);

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

  // Makes possible the blur on heaader while scrolling.
  $(window)
    .on('scroll', function () {
      var scroll = $(window).scrollTop();

      $("header").css({
        'background-size': (100 + scroll/20) + "% " + (100 + scroll/20) + "%",
      });

      $('.samples-nav').each(function (i, el) {
        var _this = $(el);
        var limit = $(_this.data('limit')).offset().top - gutter;

        if (scroll + gutter >= _this.data('start')) {
          if (!_this.hasClass('stacked')) {
            _this.addClass('stacked');
          }

          if (scroll + _this.height() < limit) {
            _this.css({
              width: _this.data('width'),
              top: Math.fround(scroll - _this.data('start') + gutter)
            });
          }
        }

        else if (scroll < _this.data('start') && _this.hasClass('stacked')) {
          _this.removeClass('stacked');
          _this.css({
            top: '',
            width: ''
          });
        }
      });

    })
    .on('scroll resize', function () {
      var scroll = $(window).scrollTop();

      $('.spy')
        .removeClass('active')
        .each(function (i, el) {
          var _el = $(el);
          var ref = $(_el.attr('href'));

          if (ref.offset() !== undefined && scroll >= ref.offset().top && scroll < ref.offset().top + ref.height()) {
            _el.addClass('active');
            return false;
          }
        });

      // get version shield from github/shilds.io
      // @deprecated
      // $.get('https://img.shields.io/github/release/rogeriotaques/seed-css.json', function (data) {
      //   $('#release').html( data.value );
      // });
    });

}(jQuery));
