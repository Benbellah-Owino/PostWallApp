const express = require("express")
const postRouter = express.Router()

const { likePost, getMyPosts, getOriginalPoster, getReplies, editPost, deletePost, getSingleUserPost, post, comment, getAllPosts, getPost, getMedia, checkForLike } = require("../controllers/posts")

postRouter.post("/post", post);
postRouter.post("/comment", comment);
postRouter.post("/like", likePost);
postRouter.post("/editpost", editPost)
postRouter.get("/getposts", getAllPosts);
postRouter.get("/getmyposts", getMyPosts);
postRouter.get("/getmedia", getMedia);
postRouter.get("/getsingleposts", getSingleUserPost);
postRouter.get("/checklike", checkForLike);
postRouter.get("/getPost", getPost);
postRouter.get("/getop", getOriginalPoster);
postRouter.get("/getreplies", getReplies);
postRouter.delete("/deletepost", deletePost)

module.exports = postRouter
