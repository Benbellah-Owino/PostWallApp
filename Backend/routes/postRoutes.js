const express = require("express")
const postRouter = express.Router()

const { likePost, getMyPosts, deletePost, getSingleUserPost, post, comment, getAllPosts } = require("../controllers/posts")

postRouter.post("/post", post);
postRouter.post("/comment", deletePost);
postRouter.post("/coment", comment);
postRouter.post("/like", likePost);
postRouter.get("/getposts", getAllPosts);
postRouter.get("/getmyposts", getMyPosts);
postRouter.get("/getsingleposts", getSingleUserPost);

module.exports = postRouter
