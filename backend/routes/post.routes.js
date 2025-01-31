const express = require('express');
const { setPosts, getPosts, editPost, deletePost, likePost, dislikePost, signup, login } = require('../controllers/post.controllers');
const router = express.Router();

router.get("/", getPosts);
router.post("/", setPosts);
router.put("/:id", editPost);
router.patch("/like-post/:id", likePost);
router.patch("/dislike-post/:id", dislikePost);
router.delete("/:id", deletePost);
router.post("/signup", signup);
router.get("/login", login);

module.exports = router;