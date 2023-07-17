const express = require("express");
const router = express.Router();

const Author = require('../modules/authors');

//* GET ALL /authors => ritorna tutti gli autori
router.get("/", async (req, res) => {
    try {
        const authors = await Author.find();
        res.json(authors);
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
});

//* GET ONE /authors/id => ritorna un autore con l'id associato
router.get("/:id", getAuthor, (req, res) => {
    res.json(res.author);
});

//* POST /authors => crea un nuovo autore
router.post("/", async (req, res) => {
    const author = new Author({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        birthDate: req.body.birthDate,
        avatar: req.body.avatar
    });

    try {
        const newAuthor = await author.save();
        res.status(201).json(newAuthor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//* PATCH/UPDATE /authors/id => modifica l'autore con l'id associato
router.patch("/:id", getAuthor, async (req, res) => {
    if (req.body.firstName != null){
        res.author.firstName = req.body.firstName; 
    }   
    if (req.body.lastName != null){
        res.author.lastName = req.body.lastName; 
    } 
    if (req.body.email != null){
        res.author.email = req.body.email; 
    } 
    if (req.body.birthDate != null){
        res.author.birthDate = req.body.birthDate; 
    } 
    if (req.body.avatar != null){
        res.author.avatar = req.body.avatar; 
    }
    
    res.author.updatedAt = Date.now(); 
    
    try {
        const updatedAuthor = await res.author.save();
        res.json(updatedAuthor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//* PUT /authors/id => modifica láutore con l'id associato
//! Con la chiamata PUT il response non pulisce gli elementi che non vengono inseriti nel req.body
router.put("/:id", getAuthor, async (req, res) => {
    if (req.body.firstName != null){
        res.author.firstName = req.body.firstName; 
    }   
    if (req.body.lastName != null){
        res.author.lastName = req.body.lastName; 
    } 
    if (req.body.email != null){
        res.author.email = req.body.email; 
    } 
    if (req.body.birthDate != null){
        res.author.birthDate = req.body.birthDate; 
    } 
    if (req.body.avatar != null){
        res.author.avatar = req.body.avatar; 
    }

    res.author.updatedAt = Date.now(); 
    
    try {
        const updatedAuthor = await res.author.save();
        res.json(updatedAuthor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//* DELETE authors/id => cancella l'autore con l'id associato
router.delete("/:id", getAuthor, async (req, res) => {
    try {
        await res.author.deleteOne();
        res.json({ message: 'Author deleted!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
});

//* GET /authors/:id/blogPosts/ => ritorna tutti i blog post di uno specifico autore dal corrispondente ID
//! La chiamata non sembra funzionare correttamente, probabilmente perché c'é bisogno di unire le due collection
router.get('/:id/blogPosts', async (req, res) => {
    try {
      const authorId = req.params.id;
      const blogPosts = await BlogPost.find({ 'author._id': authorId });
      res.json(blogPosts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


async function getAuthor(req, res, next) {
    let author;
    try {
        author = await Author.findById(req.params.id);
        if (author == null) {
            return res.status(404).json({ message: 'Author not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });

    }

    res.author = author;
    next();
};

module.exports = router;
