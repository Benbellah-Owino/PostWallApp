const User = require("../models/UserModel")
const path = require("path")
const ProfilePic = require("../models/profilePic")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { signToken, sendToken } = require("../token")
const isAuth = require("../middleware/isAuth")
const { unblock } = require("../middleware/automatedFunctions")
const timestamp = require("../middleware/getTime");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "profile_pictures")
    },
    filename: async (req, file, cb) => {
        const { username } = req.query
        console.log(file);
        let name = file.originalname
        name = name.split(".")[0]

        let user = username.split(" ")[0];
        cb(null, "postwall_profile_pic" + Date.now() + user + path.extname(file.originalname))
    }
})

let userCreds = {};

const createUser = (async (req, res) => {
    const { email, password, name } = req.body

    res.clearCookie("authtoken", { domain: "localhost", path: "/" })
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
        userOBJ.refreshToken = "";
        const newUser = await User.create(userOBJ)
        // const token = signToken(newUser._id, newUser.name)
        // sendToken(res, token);
        //console.log(token)
        var date = new Date();
        var current_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        console.log(`User object ${newUser} created at ${current_date}`);
        res.status(201).json({ username: newUser.name, id: newUser._id })
        // sendRefreshToken(res, refreshToken)
        // sendToken(req, res, accessToken)
    } catch (error) {
        console.log(error)
        res.status(400).send("Error")
    }
})

//Set use profile pic
const setProfilePic = async (req, res) => {
    try {
        const filename = req.file.filename;
        console.log('\n\nFile saved as:', filename);
        console.log(req.file)

        let { id } = req.query

        console.log(id)

        let media = await ProfilePic.create({
            fileName: filename,
            user: id
        })

        console.log(media)

        res.status(201).json({ msg: "Profile pic Added Succesfully" })
    } catch (error) {
        console.log(`controllers > user.js> setProfilePic > 80 : \n ${error}`)
        res.status(500)
    }
}


const loginUser = (async (req, res) => {
    res.clearCookie("authtoken")
    const { name, password } = req.body

    if (!password || !name) {
        res.status(400).send("Please fill all the fields in the login form");
    }
    try {
        let user = await User.findOne({ name: name })


        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            res.status(200).json({ msg: "Invalid credentials" })
        }
        else {

            userCreds = user


            const token = signToken(user._id, user.name)
            sendToken(res, token);


            user = await User.findByIdAndUpdate({ _id: user._id, refreshToken: token })

            let current_date = timestamp()

            if (req.session.loginCount) {
                req.session.loginCount = req.session.loginCount + 1;
            }
            else {
                req.session.loginCount = 1
            }
            console.log(req.session.loginCount)

            console.log(`Username${user.name} id${user._id} has logged in at ${current_date}`)
            res.status(200).json({ msg: "Succesfull Login" });
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({ msg: "Error occured" });
    }
}
)

const refresh = (req, res) => {
    if (req.cookies.refreshtoken) {
        const refreshToken = req.cookies.authtoken;

        jwt.verify(refreshToken, process.env.REFRESH_SECRET,
            (err, decoded) => {
                if (err) {
                    return res.status(406).json({ message: "Unauthorized" });
                }
                else {

                    const accessToken = signToken(userCreds._id, userCreds.name, userCreds.admin, userCreds.blocked)
                    return sendToken(req, accessToken)
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
        res.status(200).json({ details: `${auth.authtoken}` })
    }
}

const getUser = async (req, res) => {
    const { id } = req.query

    try {

        const projection = { name: 1 }
        const user = await User.findById({ _id: id }, projection)
        res.status(200).json({ msg: user, status: "pass" })
    } catch (error) {
        //console.log(error)
        res.status(400).json({ msg: "Encounterd an error", status: "fail" })
    }
}

const profilePic = async (req, res) => {
    const { user_id } = req.query;

    try {
        const profilepic = await ProfilePic.find({ user: user_id });

        if (profilepic[0]) {
            console.log(profilepic[0])
            let pp = path.join(__dirname, '../profile_pic', `${profilepic[0].fileName}`)
            res.sendFile(pp)
        } else {
            res.json({ media: "none", status: "success" })
        }
    } catch (error) {
        console.log("controllers> user.js > profile> 190> " + error)
        res.status(500).json({ media: "none", status: "failed" })
    }
}

const logout = async (req, res) => {
    try {

        const { userId } = await isAuth(req);
        console.log(userId)

        if (!userId) {
            console.log("Server error! There is no userId");
        }
        let user = await User.findByIdAndUpdate({ _id: userId, refreshToken: "" })
        res.clearCookie("authtoken", { domain: "localhost", path: "/" })

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
        let { userId } = await isAuth(req);

        let followId = req.body.id;


        let user = await User.findByIdAndUpdate({ _id: userId }, { $push: { following: followId } }); //Add the followed user to the subject user's list of users followed 

        let followedUser = await User.findByIdAndUpdate({ _id: followId }, { $push: { followers: userId } }); //Add the subject  from the unfollowed user user's list of followers

        res.status(200).json({ msg: `You have followed ${followedUser.name}`, status: "pass" })
    } catch (error) {
        console.log(`controllers > user.js > followUser > 279 :\n ${error} \n---------------------\n`)
        res.status(500).json({ msg: "There was an error doing the requested action", status: "fail" })
    };
}

//Controller for unfollowing a user
//Route: /unfollow
const unfollowUser = async (req, res) => {
    try {
        let { userId } = await isAuth(req);

        let followId = req.body.id;


        let user = await User.findByIdAndUpdate({ _id: userId }, { $pull: { following: followId } }); //Remove the unfollowed user from the subject user's list of users followed 

        let followedUser = await User.findByIdAndUpdate({ _id: followId }, { $pull: { followers: userId } }); //Remove the subject  from the unfollowed user user's list of followers 

        res.json({ msg: `You have unfollowed ${followedUser.name}` })
    } catch (error) {
        console.log(`controllers > user.js > followUser > 299 :\n ${error} \n---------------------\n`)
        res.status(500).json({ msg: "There was an error doing the requested action", status: "fail" })
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

    const { userId } = await isAuth(req)
    const users = await User.find()

    const followed = await User.find({ "_id": userId }, { following: 1 });

    const following = followed[0].following
    //const f= followed

    let final = []

    users.forEach((user) => {
        if (!following.includes(user._id)) {
            final.push(user)
        }
    })

    //console.log("User.js 318" + final)

    res.status(200).json({ final })
}
const getFollowing = async (req, res) => {


    const { userId } = await isAuth(req)
    const users = await User.find()

    const followed = await User.find({ "_id": userId }, { following: 1 });

    const following = followed[0].following

    let final = []

    users.forEach((user) => {
        if (following.includes(user._id)) {
            final.push(user)
        }
    })


    res.status(200).json({ final })
}

const getFollowers = async (req, res) => {

    try {
        const { userId } = await isAuth(req);

        let followers = []
        let followerArray = []

        const user = await User.findById(userId)

        if (user) {
            followers = user.followers

            for (let i = 0; i < followers.length; i++) {
                let follow = await User.findById(followers[i]);
                let obj = {
                    userName: follow.name,
                    userId: follow._id
                }
                followerArray[i] = obj
            }

            console.log(followerArray)

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
    getUserDetails,
    getUser,
    getFollowing,
    unfollowUser,
    setProfilePic,
    profilePic
}