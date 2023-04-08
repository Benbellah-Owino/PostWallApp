const mongoose = require("mongoose");

const PostsSchema = new mongoose.Schema({
    message: {
        type: String,
        required: [true, "Cannot post empty object"],  //The content of the post
        maxlength: 400
    },
    postedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "User is required to complete this action"]  //The user who as posted it
    },
    noLikes: {
        type: Number,   //The number of times the post has been liked
        default: 0
    },
    likes: [String],  //The users who have liked the post
    comments: [String],  //The users who have commented on the post 
    tagged: [String],  //The users who have been tagged by the poster
    replyTo: {
        type: mongoose.Types.ObjectId, //Id of the original post
        ref: "Post"
    },
    isReply: {
        type: Boolean,  //Check if post is a reply or not
        default: false
    },
    noReplies: {
        type: Number,  //Check for the number of replies the post has
        default: 0
    }
}, { timestamps: true })

module.exports = mongoose.model("Post", PostsSchema)