const router = require("express").Router()
const { verifyToken } = require("../utils/verify")
const { create, getPosts, deletePost, updatePost } = require("../controllers/post.controller")

router.post("/create", verifyToken, create)
router.get("/getposts", getPosts)
router.delete("/delete/:userId/:postId", verifyToken, deletePost)
router.put("/update-post/:userId/:postId", verifyToken, updatePost)

module.exports = router