const express = require("express");
const router = express.Router();
const BlogPost = require('../models/posts');
const Author = require('../models/authors');

//* GET /blogPosts => ritorna una lista di blog post con dettagli completi dell'autore
router.get("/", async (req, res) => {
  try {
    const blogPosts = await BlogPost.find().populate('author');
    res.json(blogPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//* GET /blogPosts/:id => ritorna un singolo post con i dettagli completi dell'autore
router.get("/:id", getBlogPost, async (req, res) => {
  try {
    const populatedBlogPost = await res.blogPost.populate('author');
    res.json(populatedBlogPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//* POST /blogPosts => crea un nuovo post
router.post("/", async (req, res) => {
  const { category, title, cover, readTime, author, content } = req.body;

  try {
    const blogPost = new BlogPost({
      category,
      title,
      cover,
      readTime,
      author,
      content,
    });

    const newBlogPost = await blogPost.save();

    const populatedBlogPost = await BlogPost.findById(newBlogPost._id).populate('author');

    res.status(201).json(populatedBlogPost);
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

    // Utilizza .populate() per ottenere i dettagli completi dell'autore
    await res.blogPost.populate('author').execPopulate();

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

// DELETE /blogPosts => Elimina tutti i post
router.delete("/", async (req, res) => {
  try {
    await BlogPost.deleteMany({});
    res.status(200).json({ message: 'Tutti i post sono stati eliminati correttamente' });
  } catch (error) {
    res.status(500).json({ message: 'Errore nella rimozione dei post' });
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
