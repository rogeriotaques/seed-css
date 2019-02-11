/**!
 * Seed-CSS - Scroll.
 * @author Rogerio Taques (hello@abtz.co)
 * @see https://github.com/AbtzLabs/seed-css
 * @version 2.2.0
 * @license MIT
 */

const seedScroll = function(options) {
  'use strict';

  let triggers = null;

  let revealers = null;

  let scrollTarget = 0;

  const gutter = 50;

  const defaultOptions = {
    spyScrollSelector: 'nav a.smooth',
    revealElementSelector: '.reveal',
    revealSpaceOffset: 0.2,
    revealWhenVisible: 'visible',
    revealSingleAnimation: 'visible-once',
    revealWhenHidden: 'hidden'
  }; // defaultOptions

  const fnUpdateActiveTrigger = (elem) => {
    triggers.forEach((el) => {
      el.classList.remove('active');
    });

    if (elem) {
      elem.classList.add('active');
    }
  }; // fnUpdateActiveTrigger

  const fnGetOffset = (elem) => {
    const bodyOffset = document.body.getBoundingClientRect();
    const offset = elem.getBoundingClientRect();

    return {
      top: Math.ceil(offset.top - bodyOffset.top),
      left: Math.ceil(offset.left - bodyOffset.left)
    };
  }; // fnGetOffset

  const fnScrollComplete = (evt) => {
    if (window.scrollY === scrollTarget) {
      const seedCustomEvent = new CustomEvent('scroll.complete');
      document.dispatchEvent(seedCustomEvent);
    }

    if (triggers) {
      const firstElementOffset = fnGetOffset(triggers[0]);

      if (window.scrollY < firstElementOffset.top) {
        fnUpdateActiveTrigger();
      }

      triggers.forEach((el, i) => {
        try {
          const targetID =
            el.getAttribute('href') || el.getAttribute('data-target');

          const target = document.querySelector(targetID);
          const offset = fnGetOffset(target);

          if (offset.top - gutter <= window.scrollY) {
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

  const fnTriggerClick = (evt) => {
    if (evt) {
      evt.preventDefault();
    }

    const target =
      evt.currentTarget.getAttribute('href') ||
      evt.currentTarget.getAttribute('data-target');

    if (target) {
      const elem = document.querySelector(target);

      scrollTarget = fnGetOffset(elem).top - gutter; // add some gutter

      window.scrollTo({
        behavior: 'smooth',
        left: 0,
        top: scrollTarget
      });
    }
  }; // fnTriggerClick

  const fnWatchElements = () => {
    /**
     * Get the viewport (window) dimensions.
     * @return object
     */
    const getViewportSize = () => {
      return {
        width: window.document.documentElement.clientWidth,
        height: window.document.documentElement.clientHeight
      };
    }; // getViewportSize

    /**
     * Get the current scoll position.
     * @return object
     */
    const getCurrentScroll = function() {
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
    const getElemInfo = (el) => {
      let elem = el;
      let offsetTop = 0;
      let offsetLeft = 0;
      const offsetWidth = elem.offsetWidth;
      const offsetHeight = elem.offsetHeight;

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
    const isElementVisible = (elem) => {
      const viewportSize = getViewportSize();
      const currentScroll = getCurrentScroll();
      const eInf = getElemInfo(elem);
      const spaceOffset = options.revealSpaceOffset;

      const checkBoundaries = function() {
        // The element boundaries
        const eTop = eInf.top + eInf.height * spaceOffset;
        const eLeft = eInf.left + eInf.width * spaceOffset;
        const eRight = eInf.left + eInf.width - eInf.width * spaceOffset;
        const eBottom = eInf.top + eInf.height - eInf.height * spaceOffset;

        // The window boundaries
        const wTop = currentScroll.y + 0;
        const wLeft = currentScroll.x + 0;
        const wBottom = currentScroll.y - 0 + viewportSize.height;
        const wRight = currentScroll.x - 0 + viewportSize.width;

        // Check if the element is within boundary
        return (
          eTop < wBottom && eBottom > wTop && eLeft > wLeft && eRight < wRight
        );
      };

      return checkBoundaries();
    }; // isElementVisible

    /**
     * Watch the target elements with a loop to identify which one is inside the viewport.
     * If found, the element gets a class defined in the options.
     * @return void
     */
    const toggleElement = () => {
      if (!revealers) {
        return;
      }

      for (let i = 0; i < revealers.length; i += 1) {
        if (isElementVisible(revealers[i])) {
          if (options.revealWhenVisible) {
            revealers[i].classList.add(options.revealWhenVisible);
          }

          if (options.revealWhenHidden) {
            revealers[i].classList.remove(options.revealWhenHidden);
          }
        } else {
          if (
            revealers[i].classList.contains(options.revealSingleAnimation) ===
            false
          ) {
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
    const scrollResizeHandler = (evt) => {
      toggleElement();
    };

    window.addEventListener('scroll', scrollResizeHandler, false);
    window.addEventListener('resize', scrollResizeHandler, false);
  }; // fnWatchElements

  window.oldOnscroll = window.onscroll;
  window.onscroll = fnScrollComplete;

  options = Object.assign({}, defaultOptions, options);

  // Find all existing triggers for smooth scrolling
  triggers = document.querySelectorAll(options.spyScrollSelector);

  // Find all existing targets for watching the viewport
  revealers = document.querySelectorAll(options.revealElementSelector);

  if (triggers !== null) {
    triggers.forEach(function(trigger, i) {
      trigger.addEventListener('click', fnTriggerClick);
    }); // triggers.forEach(function(trigger, i)
  } // if (triggers !== null)

  if (revealers) {
    fnWatchElements();
  }

  return {};
}; // seedScroll

if (typeof module !== 'undefined') {
  if (typeof module.exports.SeedCSS === 'undefined') {
    module.exports.SeedCSS = {};
  }

  module.exports.SeedCSS.scroll = seedScroll;
} else {
  if (typeof window.SeedCSS === 'undefined') {
    window.SeedCSS = {};
  }

  window.SeedCSS.scroll = seedScroll;
}
