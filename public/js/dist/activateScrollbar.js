import calculateScrollbar from './calculateScrollbar.js';
import updateBlogMode from './updateBlogMode.js';

/**
 *
 * @param {HTMLElement} parent - The parent element where the scrollbar is placed
 */

function activateScrollbar(parent) {
  // Init scrollbar
  const scrollbar = document.querySelector('.scrollbar');
  const navBar = document.querySelector('nav');
  const blogSection = document.querySelector('.blog-active');
  const scrollWrapper = document.querySelector('.scroll');
  const blogActive = document.querySelector('.blog-active');

  calculateScrollbar(parent, scrollbar);
  updateBlogMode(navBar, blogSection, scrollWrapper, blogActive, scrollbar);

  // Setup a timer
  let timeout;
  // Listen for resize events
  parent.addEventListener(
    'scroll',
    function(event) {
      // If there's a timer, cancel it
      if (timeout) {
        window.cancelAnimationFrame(timeout);
      }
      calculateScrollbar(parent, scrollbar);

      // Setup the new requestAnimationFrame()
      timeout = window.requestAnimationFrame(function() {});
    },
    false
  );
}

export default activateScrollbar;
