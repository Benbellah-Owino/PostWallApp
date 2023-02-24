const Post = require("../models/PostsModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { createAccessToken, createRefreshToken, sendAccessToken, sendRefreshToken } = require("../token")
const { application } = require("express")
const isAuth = require("../middleware/isAuth")
const { unblock } = require("../middleware/automatedFunctions")
const timestamp = require("../middleware/getTime");
const UserModel = require("../models/UserModel")



const post = async (req, res) => {
    try {
        const auth = await isAuth(req, res);
        const user = auth.userId

        if (!auth) {
            res.status(400).json({ "msg": "Please login" })
        }

        const { message, tagged } = req.body;

        const postObject = {
            message,
            postedBy: user,
            tagged: tagged || ""
        }



        const post = await Post.create(postObject)

        res.status(200).json({ msg: "Post created succefully" })
    } catch (error) {
        console.log(error)
        res.status(400).json({ msg: "Post not created" })
    }
}


const comment = async (req, res) => {
    const userId = isAuth(req);

    const { message, tagged, originalPost } = req.body;

    const commentObject = {
        message,
        createdBy: userId,
        originalPost,
        tagged
    }

    await Post.create(commentObject);

    res.json({ msg: "Comment sent succesfully" })
}

const likePost = async (req, res) => {
    const userId = isAuth(req);

    const { postId } = req.body



    const opPost = await Post.findById({ _id: postId })
    if (opPost) {
        const isItLiked = await Post.find({ liked: userId })

        if (isItLiked == false) {
            await Post.findByIdAndUpdate({ _id: postId }, { $push: { likes: userId } });
            await Post.findByIdAndUpdate({ _id: postId }, { noLikes: { $inc: 1 } });
        }
        else if (isItLiked == true) {
            const liked = await Post.findByIdAndUpdate({ _id: postId }, { $pull: { likes: userId } });
            await Post.findByIdAndUpdate({ _id: postId }, { noLikes: { $inc: -1 } });
        }
    }

    await Post.findByIdAndUpdate({ _id: postId }, { noLikes: { $inc: 1 } });
}

const deletePost = async (req, res) => {
    const userId = isAuth(req);

    const { postId } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
        console.log("Error! post doesn't exist")
    }
    else if (post) {
        const isAuthor = post.postedBy
        if (userId == isAuthor) {
            await Post.findByIdAndDelete(postId)

            res.json({ msg: "Post has been succesfuly deleted!" })
        }
        else if (!userId != isAuthor) {
            console.log("Error! This operation is not authorized")
        }
    }
}

//Getting the posts
const getAllPosts = async (req, res) => {
    try {
        const { userId } = await isAuth(req);

        const blocked = await UserModel.findById({ userId }).blockedUsers


        const posts = await Post.find().limit(20)
        let finalPosts = [];

        if (posts) {
            posts.forEach(post => {
                let id = post._id
                let flagged = false
                if (blocked) {
                    blocked.forEach(block => {
                        if (block == id) {
                            flagged = true
                        }
                    });
                }
                if (flagged === false) {
                    finalPosts.push(post)
                }
            });
        }

        res.status(200).json({ finalPosts })
    } catch (error) {
        res.status(404).json({ msg: "An error occured" })
        console.log(error)
    }
}

const getSingleUserPost = async (req, res) => {
    try {
        const userId = isAuth(req)

        const { targetId } = req.body

        const blocked = await UserModel.findById(targetId)

        if (blocked) {
            let blockArray = blocked.blockedUsers

            blockArray.forEach(block => {
                if (block == userId) {
                    res.status(401).json({ msg: "You are blocked by the user" })
                }
            });

            const posts = await Post.find({ postedBy: targetId })

            res.status(200).json({ posts })
        }
    } catch (error) {
        console.log(error)
    }
}

const getMyPosts = async (req, res) => {
    try {
        const { userId } = await isAuth(req);
        console.log(userId)
        // let mongoUser = `ObjectId('${userId}')`
        // console.log(mongoUser)

        const posts = await Post.find({ postedBy: userId });

        console.log(posts)

        res.status(200).json({ posts });
    } catch (error) {
        res.status(400).json({ msg: "A problem as occured. Kindly refresh or check your network" });
        console.log(error);
    }
}

module.exports = {
    post,
    comment,
    likePost,
    deletePost,
    getAllPosts,
    getSingleUserPost,
    getMyPosts
}