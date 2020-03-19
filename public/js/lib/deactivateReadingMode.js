/**
 * Function for deactivating reading mode (used for navigating)
 * @param {array} elements - Array containing the id's of every blog element
 */

const blogScrollingPart = document.querySelector('.blog-scrolling');
const blogActive = document.querySelector('.blog-active');
const scrollWrapper = document.querySelector('.scroll');
const navBar = document.querySelector('nav');
const navBarOverlay = navBar.querySelector('.nav-overlay');
const footer = document.querySelector('.footer');

const deactivateReadingMode = (elements, setReadingMode) => {
  elements.forEach(element => {
    document.getElementById(element).classList.remove('blog-part-left');
  });

  blogScrollingPart.classList.remove('blog-scrolling-left');
  blogActive.classList.remove('blog-active-show');
  scrollWrapper.classList.remove('scroll-full');
  navBarOverlay.classList.add('nav-overlay-hidden');
  document.title = 'Mathias Picker';
  footer.classList.remove('no');

  setReadingMode(false);
};

export default deactivateReadingMode;
