/**
 * Function for fetching blog-posts from server
 */
async function getBlogPosts() {
  const response = await fetch('/blogposts', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const blogPosts = await response.json();

  return blogPosts;
}

export default getBlogPosts;
