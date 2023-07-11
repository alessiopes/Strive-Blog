const express = require("express");
const router = express.Router();

const Author = require('../modules/authors');

//* GET ALL
router.get("/", async (req, res) => {
    try {
        const authors = await Author.find();
        res.json(authors);
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
});

//* GET ONE
router.get("/:id", getAuthor, (req, res) => {
    res.json(res.author);
});

//* CREATE ONE
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

//* UPDATE ONE
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

//* DELETE ONE
router.delete("/:id", getAuthor, async (req, res) => {
    try {
        await res.author.deleteOne();
        res.json({ message: 'Author deleted!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
