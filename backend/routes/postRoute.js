const express = require('express');
const {createPosts, getPosts} = require('../controllers/postController');
const router = express.Router();

router.get('/', (req, res) => {
    getPosts(req,res);
});

router.post('/', (req, res) => {
    createPosts(req,res);
});

module.exports = router;