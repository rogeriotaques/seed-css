/**!
 * Seed-CSS - Scroll.
 * @author Rogerio Taques (hello@abtz.co)
 * @see https://github.com/AbtzLabs/seed-css
 * @version 2.0.1
 * @license MIT
 */

const seedScroll = function(options = {}) {
  'use strict';

  // const defaultOptions = {
  //   smoothScrollClass: 'smooth',
  //   revealWhenVisibleClass: 'reveal'
  // };

  // const fnTriggerClick = (evt) => {
  //   if (evt) {
  //     evt.preventDefault();
  //   }

  //   console.log('CLICKED');
  // }; // fnTriggerClick

  // const o = Object.assign(defaultOptions, options);

  // // Find all existing triggers for smooth scrolling
  // const triggers = document.querySelectorAll(`a.${o.smoothScrollClass}`);

  // // // Find all existing offcanvas
  // // const canvases = document.querySelectorAll('.offcanvas');

  // if (triggers !== null) {
  //   triggers.forEach(function(trigger, i) {
  //     console.log('TRIGGER', trigger);
  //     trigger.addEventListener('click', fnTriggerClick);
  //   }); // triggers.forEach(function(trigger, i)
  // } // if (triggers !== null)

  // return {
  //   getSmoothTriggers: (idx) => {
  //     if (typeof idx === 'string') {
  //       let trigger = false;

  //       triggers.forEach((node) => {
  //         if (node.getAttribute('href') === idx.replace(/^#/, '')) {
  //           trigger = node;
  //           return;
  //         }
  //       });

  //       return trigger;
  //     }

  //     if (typeof triggers[idx] !== 'undefined') {
  //       return triggers[idx];
  //     }

  //     return false;
  //   }
  // };
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
