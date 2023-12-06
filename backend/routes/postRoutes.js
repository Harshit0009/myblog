const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middlewares/auth.js');
const { createPost, showPost, getSinglePost, deletePost, updatePost, addComment, addLike, removeLike } = require("../controllers/postController");

router.post("/post/create", isAuthenticated, isAdmin, createPost);
router.get("/posts/show", showPost);
router.get("/post/:id", getSinglePost);
router.delete("/delete/post/:id", isAuthenticated, isAdmin, deletePost);
router.put('/update/post/:id', isAuthenticated, isAdmin, updatePost);
router.put('/comment/post/:id', isAuthenticated, addComment);
router.put('/addlike/post/:id', isAuthenticated, addLike);
router.put('/removelike/post/:id', isAuthenticated, removeLike);

module.exports = router;