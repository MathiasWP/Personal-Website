import activateDoubleClick from './activateDoubleClick.js';
import deactivateReadingMode from './deactivateReadingMode.js';
import updateBlogMode from '../dist/updateBlogMode.js';

const blogScrollingPart = document.querySelector('.blog-scrolling');
const scrollWrapper = document.querySelector('.scroll');
const scrollbar = document.querySelector('.scrollbar');
const blogActive = document.querySelector('.blog-active');
const navBar = document.querySelector('nav');
const navBarOverlay = navBar.querySelector('.nav-overlay');
const footer = document.querySelector('.footer');

/**
 *  Function for activating reading mode (when clicking on a blogpost)
 * @param {array} elements - Array containing the id's of every blog element
 */

const activateReadingMode = (elements, setReadingMode) => {
  elements.forEach(element => {
    document.getElementById(element).classList.add('blog-part-left');
  });

  footer.classList.add('no');
  blogScrollingPart.classList.add('blog-scrolling-left');
  blogActive.classList.add('blog-active-show');
  scrollWrapper.classList.add('scroll-full');
  navBarOverlay.classList.remove('nav-overlay-hidden');

  updateBlogMode(navBar, blogActive, scrollWrapper, scrollbar);

  activateDoubleClick(navBarOverlay, () => {
    deactivateReadingMode(elements, boolean => {
      setReadingMode(boolean);
    });
  });

  setReadingMode(true);
};

export default activateReadingMode;
