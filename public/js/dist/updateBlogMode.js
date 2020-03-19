import amountScrolled from './amountScrolled.js';
import calculateScrollbar from './calculateScrollbar.js';

/**
 * // Function for creating the "full-page-reading-mode" when scrolling under navbar.
 * // All arguments are dome-element
 * @param {HTMLElement} navBar
 * @param {HTMLElement} blogSection
 * @param {HTMLElement} scrollWrapper
 * @param {HTMLElement} blogActive
 * @param {HTMLElement} scrollbar
 */

function updateBlogMode(navBar, blogActive, scrollWrapper, scrollbar) {
  const scrollDistance = amountScrolled();

  if (scrollDistance < navBar.scrollHeight) {
    blogActive.classList.remove('blog-active-set');
    scrollWrapper.classList.remove('scroll-full');

    blogActive.style.transform = `translateY(${navBar.scrollHeight -
      scrollDistance}px)`;
  } else {
    blogActive.style = '';
    scrollWrapper.style = '';

    // Calculate values for scrollbar when activating on scroll
    calculateScrollbar(blogActive, scrollbar);

    blogActive.classList.add('blog-active-set');
    scrollWrapper.classList.add('scroll-full');
  }
}

export default updateBlogMode;
