const express = require('express');
const app = express();
const port = 3000;

const { sendBlogPostsFromFolder } = require('./lib/parseBlogPosts');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => res.sendFile('index.html'));

app.post('/blogposts', async (req, res) => {
  const data = await sendBlogPostsFromFolder('blog-posts');
  res.send(data);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
