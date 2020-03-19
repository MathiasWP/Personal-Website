'use strict';

import getBlogPosts from './js/lib/getBlogPosts.js';
import createBlogPosts from './js/lib/createBlogPosts.js';
import showCurrentBlogPost from './js/lib/showCurrentBlogPost.js';
import activateReadingMode from './js/lib/activateReadingMode.js';
import deactivateReadingMode from './js/lib/deactivateReadingMode.js';
import updateBlogMode from './js/dist/updateBlogMode.js';

(async () => {
  const blogScrolling = document.querySelector('.blog-scrolling');

  const loadingText = document.createElement('div');
  loadingText.classList.add('loading-text');
  loadingText.textContent = 'Laster...';
  blogScrolling.appendChild(loadingText);

  // Get blogposts from server
  const blogPosts = await getBlogPosts();

  // pageFlags, basically knowing what states site is in
  const pageFlags = {
    readingMode: false,
    currentlyShowingBlog: ''
  };

  // Storing history-states
  const historyStates = {
    frontPage: 'frontPage',
    blogPage: 'blogPage'
  };

  // Word used in-between blog-ids and url. Must start with hash and end with a valid splitting-symbol
  const urlWord = '#woooooo-';

  // If none, we are on homepage
  const currentLocation = location.hash;

  // Storing the ID gotten from url, maybe it's correct????
  let maybeBlogID = '';

  if (currentLocation.startsWith(urlWord)) {
    // Splitting up the url with the last symbol in urlWord
    const urlParts = currentLocation.split(urlWord[urlWord.length - 1]);
    maybeBlogID = urlParts[1];
  } else {
    const footer = document.querySelector('.footer');
    footer.classList.add('footer-active');
  }

  // Array for storing all blog-posts ids
  const blogPostsIDs = [];

  // Going through all blogsposts and extracting the id, adding it to array with all blog-ids
  blogPosts.forEach(blog => {
    // Blog id should alway be last in blogObject array
    const blogID = blog[blog.length - 1];
    blogPostsIDs.push(blogID);
  });

  /**
   *
   * @param {boolean} boolean - Defines if readingmode is true of false. Used for setting pageFlag values
   * // If false, we set currently showing blog to none
   */

  const setPageFlags = boolean => {
    if (boolean === false) {
      // No blog is currently showing
      pageFlags.currentlyShowingBlog = '';
      // Pushing frontPage to history state and changing the url
      history.pushState(historyStates.frontPage, document.title, '/');
    }
    pageFlags.readingMode = boolean;
  };

  if (blogPostsIDs.find(id => id === maybeBlogID) !== undefined) {
    // Have to create other blogsposts aswell
    createBlogPosts(blogPosts, () => {
      // When all blogposts have been created, add eventlistener
      blogPostsIDs.forEach(blogID => {
        // Onclick so it doesn't stack when assigning under
        document.getElementById(blogID).onclick = function() {
          activateBlogPost(this.id);
        };
      });
    });
    // Some footer enhancing for animation and loadingshit
    const footer = document.querySelector('.footer');
    footer.addEventListener('transitionend', function() {
      this.classList.add('footer-active');
    });

    // Have to activate the blog-post from url
    activateBlogPost(maybeBlogID);

    pageFlags.currentlyShowingBlog = maybeBlogID;
  } else {
    // Pushing frontPage to history state and changing the url
    history.pushState(historyStates.frontPage, document.title, '/');

    const footer = document.querySelector('.footer');
    footer.classList.add('footer-active');
  }

  // DOM-elements
  const scrollWrapper = document.querySelector('.scroll');
  const scrollbar = document.querySelector('.scrollbar');
  const blogActive = document.querySelector('.blog-active');
  const navBar = document.querySelector('nav');

  window.onpopstate = function(event) {
    if (event.state === historyStates.frontPage) {
      deactivateReadingMode(blogPostsIDs, boolean => {
        setPageFlags(boolean);
      });
    } else if (event.state === historyStates.blogPage) {
      activateReadingMode(blogPostsIDs, boolean => {
        setPageFlags(boolean);
      });
    } else if (event.state !== null) {
      let thisBlog = blogPosts.find(
        blogObject => blogObject[blogObject.length - 1] === event.state
      );

      if (!Array.isArray(thisBlog)) {
        thisBlog = [...thisBlog];
      }

      activateReadingMode(blogPostsIDs, boolean => {
        setPageFlags(boolean);
      });

      // Show the blog post which matches historyState
      showCurrentBlogPost(thisBlog);
    }
  };

  /**
   *
   * @param {string} blogPostID - The id of the blog we want to acticate
   */

  function activateBlogPost(blogPostID) {
    // If not in reading mode, go!
    if (!pageFlags.readingMode) {
      activateReadingMode(blogPostsIDs, boolean => {
        setPageFlags(boolean);
      });
    }

    // If post is already active, just cancel the shit
    if (pageFlags.currentlyShowingBlog === blogPostID) {
      return;
    }

    // Pushing blog-post to history state and changing the url
    history.pushState(blogPostID, document.title, urlWord + blogPostID);

    // Finding the blog-post that matches this blog-blocks id.
    // Should probably find a better way to do this, we'll see.
    const thisBlog = blogPosts.find(
      blogObject => blogObject[blogObject.length - 1] === blogPostID
    );

    // Show the blog post which has been clicked
    showCurrentBlogPost(thisBlog);

    pageFlags.currentlyShowingBlog = blogPostID;
  }

  if (blogPosts.length >= 1 && !pageFlags.readingMode) {
    createBlogPosts(blogPosts, () => {
      // When all blogposts have been created, add eventlistener
      blogPostsIDs.forEach(blogID => {
        document.getElementById(blogID).onclick = function() {
          activateBlogPost(this.id);
        };
      });
    });
  }

  // Setup a timer
  let timeout;
  // Listen for scroll events
  window.addEventListener(
    'scroll',
    function(event) {
      // If there's a timer, cancel it
      if (timeout) {
        window.cancelAnimationFrame(timeout);
      }

      // Setup the new requestAnimationFrame()
      timeout = window.requestAnimationFrame(function() {
        // This scrolling is only if in readingMode
        if (!pageFlags.readingMode) return;

        updateBlogMode(navBar, blogActive, scrollWrapper, scrollbar);
      });
    },
    false
  );
})();
