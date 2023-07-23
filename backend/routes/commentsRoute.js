const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Post = require('../models/posts');
const Author = require('../models/authors');

// GET /blogPosts/:id/comments - Ritorna tutti i commenti di uno specifico post
router.get('/blogPosts/:id/comments', async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate('comments'); // Popola i commenti nell'oggetto post
    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recuperare i commenti' });
  }
});

// GET /blogPosts/:id/comments/:commentId - Ritorna un commento specifico di un post
router.get('/blogPosts/:id/comments/:commentId', async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId);
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recuperare il commento' });
  }
});

// POST /blogPosts/:id - Aggiunge un nuovo commento ad un post specifico
router.post('/blogPosts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;
    
    // Dichiarazione della variabile post
    let post;

    // Ottieni il post dal database
    post = await Post.findById(postId);

    // Controlla se il post esiste
    if (!post) {
      return res.status(400).json({ error: 'Post non trovato' });
    }

    // Crea il commento e assegna il postId
    const newComment = new Comment({ content, postId });
    await newComment.save();

    // Aggiungi il commento al post
    post.comments.push(newComment._id);
    await post.save();

    res.json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nel creare il commento' });
  }
});


// PUT /blogPosts/:id/comment/:commentId - Modifica un commento di un post specifico
router.put('/blogPosts/:id/comment/:commentId', async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { content } = req.body;

    const updatedAt = new Date();

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content, updatedAt },
      { new: true }
    );

    res.json(updatedComment);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel modificare il commento' });
  }
});

// DELETE /blogPosts/:id/comment/:commentId - Elimina un commento specifico da un post specifico
router.delete('/blogPosts/:id/comment/:commentId', async (req, res) => {
  try {
    const postId = req.params.id;
    const commentId = req.params.commentId;

    // Rimuovi il commento dal post
    const post = await Post.findById(postId);
    post.comments.pull(commentId);
    await post.save();

    // Elimina il commento
    await Comment.findByIdAndDelete(commentId);

    res.json({ message: 'Commento eliminato con successo' });
  } catch (err) {
    res.status(500).json({ error: 'Errore nell\'eliminare il commento' });
  }
});

module.exports = router;
