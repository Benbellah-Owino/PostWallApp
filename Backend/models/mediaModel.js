const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema({
    post: {
        type: String,
    },
    postedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    fileName: {
        type: String
    }
})

module.exports = mongoose.model("Media", MediaSchema)