/**!
 * Seed-CSS - Scroll.
 * @author Rogerio Taques (hello@abtz.co)
 * @see https://github.com/AbtzLabs/seed-css
 * @version 2.0.1
 * @license MIT
 */

const seedScroll = function(options) {
  'use strict';

  let triggers = null;

  let scrollTarget = 0;

  const gutter = 50;

  const defaultOptions = {
    spyScrollContainer: 'nav',
    spyScroll: 'a.smooth',
    revealWhenVisible: '.reveal'
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
        const targetID =
          el.getAttribute('href') || el.getAttribute('data-target');

        const target = document.querySelector(targetID);
        const offset = fnGetOffset(target);

        if (offset.top - gutter <= window.scrollY) {
          fnUpdateActiveTrigger(el);
          return;
        }
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

  window.oldOnscroll = window.onscroll;
  window.onscroll = fnScrollComplete;

  options = Object.assign({}, defaultOptions, options);

  // Find all existing triggers for smooth scrolling
  triggers = document.querySelectorAll(options.spyScroll);

  if (triggers !== null) {
    triggers.forEach(function(trigger, i) {
      trigger.addEventListener('click', fnTriggerClick);
    }); // triggers.forEach(function(trigger, i)
  } // if (triggers !== null)

  //
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
