/**
 * // Function for calculating how long the scrollbar should be
 * @param {HTMLElement} blogActive - Element that is scrolled in
 * @param {HTMLElement} scrollBar - The scrollbar element
 */
const calculateScrollbar = (blogActive, scrollBar) => {
  const scrollPercentage =
    (blogActive.scrollTop + blogActive.offsetHeight) / blogActive.scrollHeight;

  scrollBar.style.transform = `scaleY(${scrollPercentage})`;
};

export default calculateScrollbar;
