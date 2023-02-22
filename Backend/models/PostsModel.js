const mongoose = require("mongoose");

const PostsSchema = new mongoose.Schema({
    message: {
        type: String,
        required: [true, "Cannot post empty object"],
        maxlength: 400
    },
    postedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "User is required to complete this action"]
    },
    noLikes: {
        type: Number,
        default: 0
    },
    likes: [String],
    comments: [String],
    tagged: {
        type: String,
        default: ""
    },
    originalPost: String
}, { timestamps: true })

module.exports = mongoose.model("Post", PostsSchema)