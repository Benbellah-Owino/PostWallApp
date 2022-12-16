const User = require("../models/UserModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { createAccessToken, createRefreshToken, sendAccessToken, sendRefreshToken } = require("../token")
const { application } = require("express")
const isAuth = require("../middleware/isAuth")
const { unblock } = require("../middleware/automatedFunctions")
const timestamp = require("../middleware/getTime");
const session = require("express-session");



let userCreds = {};

const createUser = (async (req, res) => {
    const { email, password, name } = req.body


    const userOBJ = {
        name: name,
        email: email,
        password: password,
        postsCount: 0,
        followers: [],
        admin: false,
        superAdmin: false,
        verified: false,
        blocked: false
    }


    try {
        const accessToken = createAccessToken(userOBJ.id, userOBJ.name, userOBJ.admin, userOBJ.blocked);
        const refreshToken = createRefreshToken(userOBJ._id, userOBJ.name);
        userOBJ.refreshToken = refreshToken
        const newUser = await User.create(userOBJ)
        var date = new Date();
        var current_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        console.log(`User object ${newUser} created at ${current_date}`)
        sendRefreshToken(res, refreshToken)
        sendAccessToken(req, res, accessToken)
    } catch (error) {
        console.log(error)
        res.status(400).send("Error")
    }
})

const loginUser = (async (req, res) => {
    res.clearCookie("refreshtoken")
    const { name, password } = req.body

    if (!password || !name) {
        res.status(400).send("Please fill all the fields in the login form");
    }

    let user = await User.findOne({ name: name })


    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        res.status(200).send("Invalid credentials")
    }
    else {
        const access_Token = createAccessToken(user._id, user.name, user.admin, user.blocked);

        const refresh_Token = createRefreshToken(user._id, user.name);

        userCreds = user


        sendRefreshToken(res, refresh_Token)
        sendAccessToken(req, res, access_Token)


        user = await User.findByIdAndUpdate({ _id: user._id, refreshToken: refresh_Token })

        let current_date = timestamp()

        if (req.session.loginCount) {
            req.session.loginCount = req.session.loginCount + 1;
        }
        else {
            req.session.loginCount = 1
        }
        console.log(req.session.loginCount)

        console.log(`Username${user.name} id${user._id} has logged in at ${current_date}`)
    }
})

const refresh = (req, res) => {
    if (req.cookies.refreshtoken) {
        const refreshToken = req.cookies.refreshtoken;

        jwt.verify(refreshToken, process.env.REFRESH_SECRET,
            (err, decoded) => {
                if (err) {
                    return res.status(406).json({ message: "Unauthorized" });
                }
                else {

                    const accessToken = createAccessToken(userCreds._id, userCreds.name, userCreds.admin, userCreds.blocked)
                    return sendAccessToken(req, res, accessToken)
                }
            })
    } else {
        return res.status(406).json({ message: "Unauthorized access" })
    }
}

const getUserDetails = (req, res) => {
    const auth = req.cookies;
    if (!auth) throw new Error("You need to login")
    else {

        res.status(200).json({ details: `${auth.refreshtoken}` })
    }
}

const logout = async (req, res) => {
    try {

        const userId = userCreds._id
        console.log(userId)

        if (!userId) {
            console.log("Server error! There is no userId");
        }
        let user = await User.findByIdAndUpdate({ _id: userId, refreshToken: "" })
        res.clearCookie("refreshtoken", { path: "/refresh" })

        let current_date = timestamp()

        console.log(`Username${userCreds.name} id${userCreds._id} has logged out at ${current_date}`)



        console.log(user)
        userCreds = {}
        return res.json({
            message: "Logged out"
        })
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const changePassword = async (req, res) => {
    try {
        let body = req.body

        let nameExists = await User.findOne({ name: body.name })

        if (nameExists) {
            let emailIsTrue = await bcrypt.compare(email, nameExists.email)

            if (!emailIsTrue) {
                res.json({ message: "The user does not exist" })
            }
            else {

            }
        }
    } catch (error) {
        console.log(error)
    }
}

//Admin Functions
const blockAccount = async (req, res) => {
    try {

        const subject = req.body
        const userId = isAuth(req)

        if (userId !== null) {
            res.json({ msg: "Please login" })
        }
        const user = await User.findById({ _id: userId })

        if (!user) {
            res.json({ msg: "Operation error" })
        }

        if (user.admin === true) {
            if (!subject.blocked) {
                let blocked = await User.findByIdAndUpdate({ _id: subject._id, blocked: true })

                await unblock(subject.days, subject._id)

                let current_date = timestamp()

                console.log(`Username ${subject.name} id${subject._id} status was changed to blocked at ${current_date}`)
                res.json({ message: 'User has been succesfully blocked' })
            }
            else if (subject.blocked) {
                let unblock = await User.findByIdAndUpdate({ _id: subject._id, blocked: true })

                console.log(`Username ${subject.name} id${subject._id} was unblocked at ${current_date}`)
                res.json({ message: 'User has been succesfully unblocked' })
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const verifyAccount = async (req, res) => {

    try {
        const subject = req.body
        const userId = isAuth(req)

        if (userId !== null) {
            res.json({ msg: "Please login" })
        }
        const user = await User.findById({ _id: userId })

        if (!user) {
            res.json({ msg: "Operation error" })
        }

        if (user.admin === true) {
            if (!subject.blocked) {
                let blocked = await User.findByIdAndUpdate({ _id: subject._id, verified: true })

                await unblock(subject.days, subject._id)

                let current_date = timestamp()

                console.log(`Username ${subject.name} id${subject._id} status was changed to verified at ${current_date}`)
                res.json({ message: 'User has been succesfully verified' })
            }
            else if (subject.blocked) {
                let unblock = await User.findByIdAndUpdate({ _id: subject._id, verified: true })

                console.log(`Username ${subject.name} id${subject._id} was unverified at ${current_date}`)
                res.json({ message: 'User has been succesfully been verified' })
            }
        }
    } catch (error) {
        console.log(error)
    }
}


//User Functions

const followUser = async (req, res) => {
    try {
        let userId = isAuth(req);

        let followId = req.id;

        let user = await User.findByIdAndUpdate({ _id: userId }, { $push: { following: followId } });

        let followedUser = await User.findByIdAndUpdate({ _id: followId }, { $push: { followers: userId } });

        res.send(`You have followed ${followedUser.name}`)
    } catch (error) {
        console.log(error)
    };
}

const blockUser = async (req, res) => {

    try {
        let userId = isAuth(req);
        let followId = req.id;

        let user = await User.findByIdAndUpdate({ _id: userId }, { $push: { blockedUsers: followId } });

        res.send(`User blocked successfully`);
    } catch (error) {
        console.log(error)
    }
}


// Get requests for users

//Getting all users
const getUsers = async (req, res) => {
    const users = await User.find()

    res.status(200).json({ users })
}

const getFollowers = async (req, res) => {
    try {
        const userID = isAuth(req);

        let followers
        let followerArray = []

        const user = await User.findById(userID)

        if (user) {
            followers = user.followers

            followers.forEach(async follower => {
                let follow = await User.findById(follower);
                let obj = {
                    userName: follow.name,
                    userId: follow._id
                }
                followerArray.push(obj)
            });

            res.status(200).json({ followerArray })
        }
        else if (!user) {
            res.status(400).json({ message: "You are not has been a problem " })
        }
    } catch (error) {
        res.status(404).json({ msg: "An error as occured" })
        console.log(error)
    }
}

module.exports = {
    createUser,
    loginUser,
    refresh,
    logout,
    blockAccount,
    blockUser,
    followUser,
    verifyAccount,
    changePassword,
    getUsers,
    getFollowers,
    getUserDetails
}