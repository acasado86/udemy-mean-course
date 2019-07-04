const express = require('express');

const postsController = require('../controllers/posts');

const router = express.Router();


router.post('', ...postsController.createPost);

router.put('/:id', ...postsController.updatePost);

router.get('', postsController.getPosts);

router.get("/:id", postsController.getSinglePost);

router.delete("/:id", ...postsController.deletePosts);

module.exports = router;