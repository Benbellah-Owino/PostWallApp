const express = require('express');
const app = express();
const path = require('path');

const Post = require("../models/PostsModel")
const isAuth = require("../middleware/isAuth")
const UserModel = require("../models/UserModel")

const Media = require("../models/mediaModel")




app.use(express.static(path.join(__dirname, 'upload')));

/* Glossary

// const auth = await isAuth(req, res); = Check if user is authenticated and returns an object with basic user details like Id, name and role
*/


//Controller for creating a post
//Route: /post
const post = async (req, res) => {
    try {
        const auth = await isAuth(req, res);
        const user = auth.userId; //Get the user Id

        if (!auth) {
            res.status(400).json({ "msg": "Please login" })
        }

        const { message, tagged } = req.body; //Get message and Id of tagged users

        const postObject = {
            message,
            postedBy: user,
            tagged: tagged || ""
        } //Package the important information into and object

        const post = await Post.create(postObject) //Save the post in database

        res.status(200).json({ msg: "Post created succefully", postId: post._id })
    } catch (error) {
        console.log(error)
        res.status(400).json({ msg: "Post not created" })
    }
}

//Post for commenting on a post
//Route: /comment
const comment = async (req, res) => {
    const userId = isAuth(req);

    const { message, tagged, originalPost } = req.body; //Get comment details 

    const commentObject = {
        message,
        createdBy: userId,
        originalPost,
        tagged
    }

    await Post.create(commentObject);

    res.json({ msg: "Comment sent succesfully" })
}

//Controller for liking a post
const likePost = async (req, res) => {
    const { userId } = await isAuth(req); //Get user Id

    const { postId } = req.query //Get post Id


    let newLike = "liking"  //set action  liking or deliking

    try {
        const object = await Post.findById({ _id: postId }, { likes: 1 })//Get user id's of those who've liked the post
        const arr = object.likes //Extract the likes array
        const isItLiked = arr.includes(userId) //Chekc if user Id is in likes array


        if (isItLiked == false) {   //If post has not been liked by this user then the user has liked the post

            await Post.findOneAndUpdate({ _id: postId }, { $push: { likes: userId }, $inc: { noLikes: 1 } });  //If it's not present push userId to the likes array and increase number of likes

        }
        else if (isItLiked == true) {  //If post has been liked by this user then the user has disliked the post

            await Post.findOneAndUpdate({ _id: postId }, { $pull: { likes: userId }, $inc: { noLikes: -1 } }); //If it's present remove userId from the likes array and deacrease number of likes

            newLike = "disliking"
        }


        res.status(200).json({ likestatus: newLike, status: "success" }) //Inform client of operation status
    } catch (error) {
        console.log("controllers > post.js > likePost> 91 post error:  " + error)
        res.status(400).json({ status: "fail" })
    }
}

//Check if you've liked the post
//Route:  /checkForLike
const checkForLike = async (req, res) => {
    const { userId } = await isAuth(req); //Get user Id

    const { post_id } = req.query //Get post Id

    if (!post_id) {
        console.log("controllers > post.js > checkForLike > 111: No post ID available")
        res.status(400).json({ status: "fail" })
        return
    }

    try {
        const object = await Post.findById({ _id: post_id }, { likes: 1 })//Get user id's of those who've liked the post
        const arr = object.likes //Extract the likes array
        const isItLiked = arr.includes(userId) //Chekc if user Id is in likes array


        if (isItLiked == false) {

            res.status(200).json({ liked: "false", status: "success" });

        }
        else if (isItLiked == true) {

            res.status(200).json({ liked: "true", status: "success" });
        }

    } catch (error) {
        console.log("controllers > post.js > checkForLike> 134 post error:  " + error)
        res.status(400).json({ status: "fail" })
    }
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

        const blocked = await UserModel.findById({ userId }).blockedUsers  //Get all other users who have been blocked by the user

        const posts = await Post.find().limit(20) //Limit the posts to 20




        if (posts) {
            let finalPosts = [];
            posts.forEach(async (post) => {
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

            res.status(200).json({ finalPosts })
        }


    } catch (error) {
        res.status(404).json({ msg: "An error occured" })
        console.log("post controlle 149" + error)
    }
}

const getMedia = async (req, res) => {
    const { post_id } = req.query;

    try {
        const media = await Media.find({ post: post_id });

        if (media[0]) {
            let retrieved_media = path.join(__dirname, '../uploads', `${media[0].fileName}`)
            res.sendFile(retrieved_media)
        } else {
            res.json({ media: "none", status: "success" })
        }
    } catch (error) {
        console.log("controllers> post.js > getMedia> 218> " + error)
        res.status(500).json({ media: "none", status: "failed" })
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

        // let mongoUser = `ObjectId('${userId}')`
        // console.log(mongoUser)

        const posts = await Post.find({ postedBy: userId });



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
    getMyPosts,
    getMedia,
    checkForLike
}