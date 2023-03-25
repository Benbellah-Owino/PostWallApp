const express = require('express');
const app = express();
const path = require('path');

const Post = require("../models/PostsModel")
const isAuth = require("../middleware/isAuth")
const UserModel = require("../models/UserModel")

const Media = require("../models/mediaModel")


app.use(express.static(path.join(__dirname, 'upload')));

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

        res.status(200).json({ msg: "Post created succefully", postId: post._id })
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

                    // let media = await Media.find({ post: post._id });

                    // if ("") {
                    //     let postobject = {
                    //         postObj: post,
                    //         media: "none",
                    //         error: "media retrieval error"
                    //     }

                    //     finalPosts.push(postobject)
                    // }



                    //     if (media[0]) {

                    //         let retrieved_media = path.join(__dirname, 'uploads', `${media[0].fileName}`)
                    //         let media_stream = fdtouc
                    //         let postobject = {
                    //             postObj: post,
                    //             media: retrieved_media,
                    //             error: "none"
                    //         }

                    //         console.log(postobject)

                    //         finalPosts.push(postobject);


                    //     } else {

                    //         let postobject = {
                    //             postObj: post,
                    //             media: "none",
                    //             error: "none"
                    //         }

                    //         finalPosts.push(postobject)
                    //     }


                    //     // Media.find({ post: post._id }, (err, media) => {

                    //     // if (err) {
                    //     //     let postobject = {
                    //     //         postObj: post,
                    //     //         media: "none",
                    //     //         error: "media retrieval error"
                    //     //     }

                    //     //     finalPosts.push(postobject)
                    //     // }

                    //     // if (media[0]) {
                    //     //     console.log(media)
                    //     //     let postobject = {
                    //     //         postObj: post,
                    //     //         media: media[0],
                    //     //         error: "none"
                    //     //     }

                    //     //     finalPosts.push(postobject)
                    //     // } else {

                    //     //     let postobject = {
                    //     //         postObj: post,
                    //     //         media: "none",
                    //     //         error: "none"
                    //     //     }

                    //     //     finalPosts.push(postobject)
                    //     // }
                    //     // })

                }

            });

            console.log("final posts =" + finalPosts)
            console.log("-*-*-*-*-*-*-*-*-*-*-*-*-*-*")

            res.status(200).json({ finalPosts })
        }


    } catch (error) {
        res.status(404).json({ msg: "An error occured" })
        console.log("post controlle 149" + error)
    }
}

const getMedia = async (req, res) => {
    const { post_id } = req.query;

    const media = await Media.find({ post: post_id });

    if (media[0]) {
        let retrieved_media = path.join(__dirname, '../uploads', `${media[0].fileName}`)
        res.sendFile(retrieved_media)
    } else {
        res.json({ media: "none" })
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
    getMedia
}