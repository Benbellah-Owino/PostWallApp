const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "please provide username"],
        maxlength: 50,
        minlength: 3,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide password"]
    },
    postsCount: {
        type: Number,
    },
    followers: [String],
    following: [String],
    blockedUsers: [String],
    admin: Boolean,
    superAdmin: Boolean,
    verified: Boolean,
    blocked: Boolean,
    refreshToken: String
})

UserSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)

    const eSalt = await bcrypt.genSalt(10);
    this.email = await bcrypt.hash(this.email, eSalt)
})

module.exports = mongoose.model('User', UserSchema)