const express = require("express");
const router = express.Router();
const BlogPost = require('../modules/posts');

//* GET /blogPosts => ritorna una lista di blog post
router.get("/", async (req, res) => {
  try {
    const blogPosts = await BlogPost.find();
    res.json(blogPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//* GET /blogPosts/123 => ritorna un singolo post
router.get("/:id", getBlogPost, (req, res) => {
  res.json(res.blogPost);
});

//* POST /blogPosts => crea un nuovo post
router.post("/", async (req, res) => {
  const blogPost = new BlogPost({
    category: req.body.category,
    title: req.body.title,
    cover: req.body.cover,
    readTime: req.body.readTime,
    author: req.body.author,
    content: req.body.content,
  });

  try {
    const newBlogPost = await blogPost.save();
    res.status(201).json(newBlogPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//* PUT /blogPosts/123 => modifica il blog post con l'id associato
router.put("/:id", getBlogPost, async (req, res) => {
  try {
    if (req.body.category != null) {
      res.blogPost.category = req.body.category;
    }
    if (req.body.title != null) {
      res.blogPost.title = req.body.title;
    }
    if (req.body.cover != null) {
      res.blogPost.cover = req.body.cover;
    }
    if (req.body.readTime != null) {
      res.blogPost.readTime = req.body.readTime;
    }
    if (req.body.author != null) {
      res.blogPost.author = req.body.author;
    }
    if (req.body.content != null) {
      res.blogPost.content = req.body.content;
    }

    res.blogPost.updatedAt = Date.now();

    const updatedBlogPost = await res.blogPost.save();
    res.json(updatedBlogPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//* DELETE /blogPosts/123 => cancella il blog post con l'id associato
router.delete("/:id", getBlogPost, async (req, res) => {
  try {
    await res.blogPost.deleteOne();
    res.json({ message: "Blog post deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//* GET /blogPost?title=whatever => filtra i blog post e ritorna l'unico che corrisponda alla condizione di ricerca (ad esempio titolo contiene 'whatever')
router.get('/blogPost', async (req, res) => {
  try {
    const searchTitle = req.query.title;

    if (!searchTitle) {
      return res.status(400).json({ message: 'Title is required!' });
    }

    const blogPost = await BlogPost.findOne({ title: { $regex: searchTitle, $options: 'i' } });

    if (!blogPost) {
      return res.status(404).json({ message: 'No blog post found with that title!' });
    }

    res.json(blogPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getBlogPost(req, res, next) {
  let blogPost;
  try {
    blogPost = await BlogPost.findById(req.params.id);
    if (blogPost == null) {
      return res.status(404).json({ message: "Blog post not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.blogPost = blogPost;
  next();
}

module.exports = router;
