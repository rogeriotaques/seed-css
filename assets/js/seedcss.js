"use strict";

/**!
 * A simple polyfill for CustomEvent
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
 */
(function () {
  if (typeof window.CustomEvent === 'function') return false;

  function CustomEvent(event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();
"use strict";

/**!
 * Seed-CSS - Custom HTML Input File.
 * @copyright 2019, Abtz Labs
 * @license MIT
 */
var seedFileUpload = function seedFileUpload() {
  'use strict';

  var fnChange = function fnChange(evt) {
    if (evt) {
      evt.preventDefault();
    }

    var seedCustomEvent;
    var fileName = false;
    var input = this;
    var label = input.nextElementSibling; // When multiple files are selected

    if (input.files && input.files.length > 1) {
      fileName = (input.getAttribute('data-multiple') || '{count} files').replace('{count}', input.files.length);
    } // When only one file is selected
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


  var inputs = document.querySelectorAll('.seed-file > [type="file"]');

  if (inputs !== null) {
    inputs.forEach(function (input, i) {
      // Find the field label
      var label = input.nextElementSibling;
      var cancel = label.querySelector('.cancel');
      var emptyText = input.getAttribute('data-empty') || 'No file chosen'; // If label does not exists, simply do not set it up

      if (!label) {
        return;
      } // Make sure input and label matches and works.


      if (input.getAttribute('id') && input.getAttribute('id') !== label.getAttribute('for')) {
        label.setAttribute('for', input.getAttribute('id'));
      } else if (label.getAttribute('for') && !input.getAttribute('id')) {
        input.setAttribute('id', label.getAttribute('for'));
      } else {
        input.setAttribute('id', 'file-input-' + i);
        label.setAttribute('for', 'file-input-' + i);
      } // Always the cancel button exists, adds a handler


      if (cancel) {
        cancel.addEventListener('click', function (evt) {
          if (evt) {
            evt.preventDefault();
          }

          var emptyText = input.getAttribute('data-empty') || 'No file chosen';
          input.value = '';
          input.parentNode.classList.remove('chosen');
          label.querySelector('.input').innerHTML = emptyText;
          seedCustomEvent = new CustomEvent('file.removed');
          input.dispatchEvent(seedCustomEvent);
        });
      }

      label.querySelector('.input').innerHTML = emptyText; // Start listening the field for changes

      input.addEventListener('change', fnChange);
    }); // inputs.forEach(function(input, i)
  } // if (inputs !== null)

}; // seedFileUpload


if (typeof module !== 'undefined') {
  module.exports.fileUpload = fileUpload;
} else {
  if (typeof window.SeedCSS === 'undefined') {
    window.SeedCSS = {};
  }

  window.SeedCSS.fileUpload = seedFileUpload;
}
"use strict";

/**!
 * Seed-CSS - Modal
 * @copyright 2019, Abtz Labs
 * @license MIT
 */
var fnOpen;
var fnClose;
var fnEsc;

var seedModal = function seedModal(options) {
  'use strict'; // Default settings

  var defaultOptions = {
    // the element that triggers the modal
    trigger: '[role="modal"]',
    // @see: https://daneden.github.io/animate.css/
    // animate.css classes to be used
    classAnimation: {
      open: 'bounceInDown',
      close: 'bounceOutUp'
    }
  };
  options = Object.assign({}, defaultOptions, options); // Get elements

  var modals = document.querySelectorAll('.modal');
  var modalTriggers = document.querySelectorAll(options.trigger);

  fnClose = function fnClose(modalObject) {
    if (!modalObject) {
      return;
    }

    var customEvent;
    var html = document.querySelector('html');
    var mWin = modalObject.querySelector('.modal-window');

    if (!mWin) {
      return;
    } // Removes the ESC listener


    document.removeEventListener('keydown', fnEsc); // Replace open animation to close the modal window

    mWin.classList.replace(options.classAnimation.open, options.classAnimation.close); // Add animation to the overlay

    modalObject.classList.add('delay-1s');
    modalObject.classList.replace('fadeIn', 'fadeOut'); // Wait 2 seconds before complete de process.
    // This is the time to finishing all animate.css animations

    setTimeout(function () {
      // Dispatch the 'modal.closed' event
      customEvent = new CustomEvent('modal.closed');
      modalObject.dispatchEvent(customEvent); // Completely hide the component

      modalObject.classList.add('hide'); // Reenable scrolling from the HTML

      html.style.overflow = ''; // Remove closing classes from overlay

      modalObject.classList.remove('delay-1s', 'fadeOut'); // Remove closing classes from modal window

      mWin.classList.replace(options.classAnimation.close, options.classAnimation.open);
    }, 600);
  }; // fnClose


  fnOpen = function fnOpen(modalObject) {
    if (!modalObject) {
      return;
    }

    var customEvent;
    var html = document.querySelector('html');
    var mWin = modalObject.querySelector('.modal-window'); // Handle the ESC dismiss

    fnEsc = function escHandler(e) {
      var key = e.keyCode || e.which; // When the ESC key is pressed

      if (key === 27) {
        fnClose(modalObject);
      }
    };

    if (!mWin) {
      return;
    } // Add (and remove) an ESC handler for the overlay


    document.addEventListener('keydown', fnEsc); // Clear inline display style, if any

    modalObject.style.display = ''; // Add animation to the overlay

    modalObject.classList.add('animated', 'fadeIn', 'fast'); // Add animation to the modal window

    mWin.classList.add('animated', options.classAnimation.open); // Show the component

    modalObject.classList.remove('hide'); // Finally prevent scrolling

    html.style.overflow = 'hidden'; // Wait the animation complete to dispatch the event
    // Each animate.css animation takes 1s

    setTimeout(function () {
      // Dispatch the 'modal.opened' event
      customEvent = new CustomEvent('modal.opened');
      modalObject.dispatchEvent(customEvent);
    }, 100);
  }; // fnOpen


  if (modals !== null) {
    modals.forEach(function (modal, i) {
      // Handle the dismiss buttons
      var dismissals = modal.querySelectorAll('[role="modal-dismiss"]'); // Add (and remove) a click handler on the overlay

      modal.addEventListener('click', function () {
        fnClose(modal);
      }); // Add prototype for show (open)

      modal.show = function () {
        fnOpen(modal);
      }; // Add prototype for hide (clode)


      modal.hide = function () {
        fnClose(modal);
      };

      if (dismissals !== null) {
        dismissals.forEach(function (dismiss, j) {
          dismiss.addEventListener('click', function (evt) {
            if (evt) {
              evt.preventDefault();
              evt.stopPropagation();
            }

            fnClose(modal);
          });
        });
      } // if (dismissals !== null)

    });
  } // if (modals !== null)


  if (modalTriggers !== null) {
    modalTriggers.forEach(function (trigger, i) {
      trigger.addEventListener('click', function (evt) {
        if (evt) {
          evt.preventDefault();
        }

        var ref = trigger.getAttribute('data-modal-id');

        if (ref !== null) {
          var modal = document.querySelector("#".concat(ref));
          fnOpen(modal);
        }
      });
    });
  } // if (modalTriggers !== null)


  modalTriggers = undefined;
  return {
    get: function get(idx) {
      if (typeof idx === 'string') {
        var modal = false;
        modals.forEach(function (node) {
          if (node.id === idx.replace(/^#/, '')) {
            modal = node;
            return;
          }
        });
        return modal;
      }

      if (typeof modals[idx] !== 'undefined') {
        return modals[idx];
      }

      return false;
    }
  };
}; // seedModal


if (typeof module !== 'undefined') {
  module.exports.seedModal = seedModal;
} else {
  if (typeof window.SeedCSS === 'undefined') {
    window.SeedCSS = {};
  }

  window.SeedCSS.modal = seedModal;
}
"use strict";

/**!
 * Seed-CSS - Off-Canvas.
 * @copyright 2019, Abtz Labs
 * @license MIT
 */
var seedOffCanvas = function seedOffCanvas() {
  'use strict';

  var fnToggle = function fnToggle(canvasID, triggerElement) {
    var customEvent;
    var canvas = document.querySelector("#".concat(canvasID.replace(/^#/, '')));
    var trigger = triggerElement || document.querySelector("[role=\"offcanvas\"][data-id=\"".concat(canvasID.replace(/^#/, ''), "\"]"));

    if (canvas !== null) {
      canvas.classList.toggle('open'); // Prevents scrolling the HTML

      if (canvas.classList.contains('open')) {
        if (trigger !== null) {
          // Add the 'triggered' class to the element which has triggered the offcanvas.
          trigger.classList.add('triggered');
        } // if (trigger !== null)
        // Prevents main to scroll


        document.querySelector('html').style.overflow = 'hidden';
      } else {
        // Remove the 'triggered' class for any existing trigger which refers given offcanvas.
        document.querySelectorAll("[role=\"offcanvas\"][data-id=\"".concat(canvasID.replace(/^#/, ''), "\"]")).forEach(function (tgr) {
          tgr.classList.remove('triggered');
        }); // Re-enables main scrolling

        document.querySelector('html').style.overflow = '';
      } // Wait until animation is complete to dispatch the event


      setTimeout(function () {
        if (canvas.classList.contains('open')) {
          customEvent = new CustomEvent('canvas.opened');
        } else {
          customEvent = new CustomEvent('canvas.closed');
        } // Dispatch the 'canvas.opened'/ 'canvas.closed' events


        canvas.dispatchEvent(customEvent);
      }, 300);
    } // if (canvas !== null)

  }; // fnToggle


  var fnTriggerClick = function fnTriggerClick(evt) {
    if (evt) {
      evt.preventDefault();
    }

    fnToggle(evt.currentTarget.getAttribute('data-id') || 'offcanvas', evt.currentTarget);
  }; // fnTriggerClick
  // Find all existing triggers


  var triggers = document.querySelectorAll('[role="offcanvas"]'); // Find all existing offcanvas

  var canvases = document.querySelectorAll('.offcanvas');

  if (triggers !== null) {
    triggers.forEach(function (trigger, i) {
      trigger.addEventListener('click', fnTriggerClick);
    }); // triggers.forEach(function(trigger, i)
  } // if (triggers !== null)


  if (canvases !== null) {
    canvases.forEach(function (canvas, i) {
      // Attach method for opening
      canvas.open = function () {
        fnToggle(canvas.getAttribute('id') || 'offcanvas');
      }; // open
      // Attach method for closing


      canvas.close = function () {}; // close

    }); // canvases.forEach((canvas, i)
  } // if (canvases !== null)


  return {
    get: function get(idx) {
      if (typeof idx === 'string') {
        var _canvas = false;
        canvases.forEach(function (node) {
          if (node.id === idx.replace(/^#/, '')) {
            _canvas = node;
            return;
          }
        });
        return _canvas;
      }

      if (typeof canvas[idx] !== 'undefined') {
        return canvas[idx];
      }

      return false;
    }
  };
}; // seedOffCanvas


if (typeof module !== 'undefined') {
  module.exports.seedOffCanvas = seedOffCanvas;
} else {
  if (typeof window.SeedCSS === 'undefined') {
    window.SeedCSS = {};
  }

  window.SeedCSS.offCanvas = seedOffCanvas;
}
"use strict";

/**!
 * Seed-CSS - Scroll.
 * @copyright 2019, Abtz Labs
 * @license MIT
 */
var seedScroll = function seedScroll(options) {
  'use strict';

  var triggers = null;
  var revealers = null;
  var scrollTarget = 0;
  var defaultOptions = {
    spyScrollSelector: 'nav a.smooth',
    revealElementSelector: '.reveal',
    revealSpaceOffset: 0.2,
    revealWhenVisible: 'visible',
    revealSingleAnimation: 'visible-once',
    revealWhenHidden: 'hidden',
    gutter: 50
  }; // defaultOptions

  var fnUpdateActiveTrigger = function fnUpdateActiveTrigger(elem) {
    triggers.forEach(function (el) {
      el.classList.remove('active');
    });

    if (elem) {
      elem.classList.add('active');
    }
  }; // fnUpdateActiveTrigger


  var fnGetOffset = function fnGetOffset(elem) {
    var bodyOffset = document.body.getBoundingClientRect();
    var offset = elem.getBoundingClientRect();
    return {
      top: Math.ceil(offset.top - bodyOffset.top),
      left: Math.ceil(offset.left - bodyOffset.left)
    };
  }; // fnGetOffset


  var fnScrollComplete = function fnScrollComplete(evt) {
    if (window.scrollY === scrollTarget) {
      var seedCustomEvent = new CustomEvent('scroll.complete');
      document.dispatchEvent(seedCustomEvent);
    }

    if (triggers) {
      var firstElementOffset = fnGetOffset(triggers[0]);

      if (window.scrollY < firstElementOffset.top) {
        fnUpdateActiveTrigger();
      }

      triggers.forEach(function (el, i) {
        try {
          var targetID = el.getAttribute('href') || el.getAttribute('data-target');
          var target = document.querySelector(targetID);
          var offset = fnGetOffset(target);

          if (offset.top - options.gutter <= window.scrollY) {
            fnUpdateActiveTrigger(el);
            return;
          }
        } catch (e) {}
      });
    }

    if (typeof window.oldOnscroll === 'function') {
      window.oldOnscroll(evt);
    }
  }; // fnScrollComplete


  var fnTriggerClick = function fnTriggerClick(evt) {
    if (evt) {
      evt.preventDefault();
    }

    var target = evt.currentTarget.getAttribute('href') || evt.currentTarget.getAttribute('data-target');

    if (target) {
      var elem = document.querySelector(target);
      scrollTarget = fnGetOffset(elem).top - options.gutter; // add some gutter

      window.scrollTo({
        behavior: 'smooth',
        left: 0,
        top: scrollTarget
      });
    }
  }; // fnTriggerClick


  var fnWatchElements = function fnWatchElements() {
    /**
     * Get the viewport (window) dimensions.
     * @return object
     */
    var getViewportSize = function getViewportSize() {
      return {
        width: window.document.documentElement.clientWidth,
        height: window.document.documentElement.clientHeight
      };
    }; // getViewportSize

    /**
     * Get the current scoll position.
     * @return object
     */


    var getCurrentScroll = function getCurrentScroll() {
      return {
        x: window.pageXOffset,
        y: window.pageYOffset
      };
    }; // getCurrentScroll

    /**
     * Gets the element dimension and position.
     * @param HTMLElement el
     * @return object
     */


    var getElemInfo = function getElemInfo(el) {
      var elem = el;
      var offsetTop = 0;
      var offsetLeft = 0;
      var offsetWidth = elem.offsetWidth;
      var offsetHeight = elem.offsetHeight;

      do {
        if (!isNaN(elem.offsetTop)) {
          offsetTop += elem.offsetTop;
        }

        if (!isNaN(elem.offsetLeft)) {
          offsetLeft += elem.offsetLeft;
        }
      } while ((elem = elem.offsetParent) !== null);

      return {
        top: offsetTop,
        left: offsetLeft,
        height: offsetHeight,
        width: offsetWidth
      };
    }; // getElemInfo

    /**
     * Identifies whether the element is visible in the viewport.
     * @param HTMLElement elem
     * @return boolean
     */


    var isElementVisible = function isElementVisible(elem) {
      var viewportSize = getViewportSize();
      var currentScroll = getCurrentScroll();
      var eInf = getElemInfo(elem);
      var spaceOffset = options.revealSpaceOffset;

      var checkBoundaries = function checkBoundaries() {
        // The element boundaries
        var eTop = eInf.top + eInf.height * spaceOffset;
        var eLeft = eInf.left + eInf.width * spaceOffset;
        var eRight = eInf.left + eInf.width - eInf.width * spaceOffset;
        var eBottom = eInf.top + eInf.height - eInf.height * spaceOffset; // The window boundaries

        var wTop = currentScroll.y + 0;
        var wLeft = currentScroll.x + 0;
        var wBottom = currentScroll.y - 0 + viewportSize.height;
        var wRight = currentScroll.x - 0 + viewportSize.width; // Check if the element is within boundary

        return eTop < wBottom && eBottom > wTop && eLeft > wLeft && eRight < wRight;
      };

      return checkBoundaries();
    }; // isElementVisible

    /**
     * Watch the target elements with a loop to identify which one is inside the viewport.
     * If found, the element gets a class defined in the options.
     * @return void
     */


    var toggleElement = function toggleElement() {
      if (!revealers) {
        return;
      }

      for (var i = 0; i < revealers.length; i += 1) {
        if (isElementVisible(revealers[i])) {
          if (options.revealWhenVisible) {
            revealers[i].classList.add(options.revealWhenVisible);
          }

          if (options.revealWhenHidden) {
            revealers[i].classList.remove(options.revealWhenHidden);
          }
        } else {
          if (revealers[i].classList.contains(options.revealSingleAnimation) === false) {
            if (options.revealWhenHidden) {
              revealers[i].classList.add(options.revealWhenHidden);
            }

            if (options.revealWhenVisible) {
              revealers[i].classList.remove(options.revealWhenVisible);
            }
          }
        }
      }
    }; // toggleElement

    /**
     * A handler for scrolling and resizing
     * @param window.Event evt
     * @return void
     */


    var scrollResizeHandler = function scrollResizeHandler(evt) {
      toggleElement();
    };

    window.addEventListener('scroll', scrollResizeHandler, false);
    window.addEventListener('resize', scrollResizeHandler, false);
  }; // fnWatchElements


  window.oldOnscroll = window.onscroll;
  window.onscroll = fnScrollComplete;
  options = Object.assign({}, defaultOptions, options); // Find all existing triggers for smooth scrolling

  triggers = document.querySelectorAll(options.spyScrollSelector); // Find all existing targets for watching the viewport

  revealers = document.querySelectorAll(options.revealElementSelector);

  if (triggers !== null) {
    triggers.forEach(function (trigger, i) {
      trigger.addEventListener('click', fnTriggerClick);
    }); // triggers.forEach(function(trigger, i)
  } // if (triggers !== null)


  if (revealers) {
    fnWatchElements();
  }

  return {};
}; // seedScroll


if (typeof module !== 'undefined') {
  module.exports.seedScroll = seedScroll;
} else {
  if (typeof window.SeedCSS === 'undefined') {
    window.SeedCSS = {};
  }

  window.SeedCSS.scroll = seedScroll;
}
"use strict";

/**!
 * Seed-CSS - Additional features for HTML Textareas.
 * @copyright 2019, Abtz Labs
 * @license MIT
 */
var seedTextarea = function seedTextarea() {
  'use strict'; // Find all seed-file inputs.

  var inputs = document.querySelectorAll('.field > textarea');

  if (inputs !== null) {
    inputs.forEach(function (input, i) {
      var maxLength = 0;
      var parent = input.parentNode;
      var counterLabel = parent.querySelector('[role="counter"]');
      var template = counterLabel.getAttribute('data-template') || 'Typed %a out of %b. Remaining %c.';

      var fnCalc = function fnCalc() {
        var typed = input.value.replace(/[\n\r]/g, '').length;
        var remaining = maxLength - typed;
        var minLength = Math.floor(maxLength * 0.1);
        counterLabel.innerHTML = template.replace('%a', typed).replace('%b', maxLength).replace('%c', remaining <= minLength ? "<span class=\"red\" >".concat(remaining, "</span>") : remaining);
      };

      maxLength = input.getAttribute('maxlength'); // Ignore if maxlength is not given

      if (!maxLength) {
        return;
      } // Make sure the limit is an integer


      maxLength = parseInt(maxLength); // Attach the handlers

      'keypress keydown keyup'.split(' ').forEach(function (evt) {
        input.addEventListener(evt, fnCalc, true);
      }); // Initialize the utility label

      fnCalc();
    }); // inputs.forEach(function(input, i)
  } // if (inputs !== null)

}; // seedTextarea


if (typeof module !== 'undefined') {
  module.exports.seedTextarea = seedTextarea;
} else {
  if (typeof window.SeedCSS === 'undefined') {
    window.SeedCSS = {};
  }

  window.SeedCSS.textArea = seedTextarea;
}