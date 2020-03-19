/**
 * Function for creating blog-posts
 * @param {array} blogPostsArray
 */

function createBlogPosts(blogPostsArray, callback) {
  const blogScrolling = document.querySelector('.blog-scrolling');
  blogScrolling.innerHTML = '';

  blogPostsArray.forEach(blog => {
    // Blog-part on frontpage
    const blogPreview = document.createElement('section');
    blogPreview.classList.add('blog-part');

    // Tabindex for accessibility
    blogPreview.tabIndex = 0;

    // Adding unique id to blog-post (should always be last element)
    blogPreview.id = blog[blog.length - 1];

    // Creating title-part on blog-preview
    let blogPreviewTitle = document.createElement('h2');
    blogPreviewTitle.classList.add('blog-part-title');
    blogPreviewTitle.textContent = 'Dummy title';

    // Creating description-part on blog-preview
    let blogPreviewTimestamp = document.createElement('span');
    blogPreviewTimestamp.classList.add('blog-part-timestamp');
    blogPreviewTimestamp.textContent = 'Dummy Timestamp';

    // Creating description-part on blog-preview
    let blogPreviewDescription = document.createElement('span');
    blogPreviewDescription.classList.add('blog-part-description');
    blogPreviewDescription.textContent = 'Dummy description';

    for (const element of blog) {
      if (element[0] === 'title') {
        blogPreviewTitle.textContent = element[1];
      }

      if (element[0] === 'timestamp') {
        blogPreviewTimestamp.textContent = element[1];
      }

      if (element[0] === 'description') {
        blogPreviewDescription.textContent = element[1];
      }
    }

    blogPreview.appendChild(blogPreviewTitle);
    blogPreview.appendChild(blogPreviewTimestamp);
    blogPreview.appendChild(blogPreviewDescription);

    // Adding to homepage
    blogScrolling.appendChild(blogPreview);
  });

  callback();
}

export default createBlogPosts;
