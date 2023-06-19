const mongoose = require("mongoose");

const ProfilePicSchema = new mongoose.Schema({

    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    fileName: {
        type: String
    }
})

module.exports = mongoose.model("ProfilePic", ProfilePicSchema)