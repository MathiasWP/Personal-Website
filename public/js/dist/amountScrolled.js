/**
 * // Function that gives the distance scrolled on whole page.
 * // Used for updateBlogMode, deciding wether or not user has scrolled past navbar
 */

function amountScrolled() {
  const scrollTop =
    window.pageYOffset ||
    (document.documentElement || document.body.parentNode || document.body)
      .scrollTop;
  return scrollTop;
}

export default amountScrolled;
