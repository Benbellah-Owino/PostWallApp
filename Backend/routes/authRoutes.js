const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser")
const path = require("path")

const { getUsers, getUser, getFollowers, getFollowing, createUser, setProfilePic, loginUser, logout, refresh, blockAccount, blockUser, followUser, changePassword, verifyAccount, getUserDetails, unfollowUser, profilePic } = require("../controllers/user");
const isAuth = require("../middleware/isAuth")
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "profile_pic")
    },
    filename: async (req, file, cb) => {
        const { username } = req.query
        console.log(file);
        let name = file.originalname
        name = name.split(".")[0]

        let user = username.split(" ")[0];
        cb(null, "postwall" + + Date.now() + user + path.extname(file.originalname))
    }
})

const upload = multer({ storage })
router.use(cookieParser())


router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.post("/blockAccount", blockAccount);
router.post("/blockUser", blockUser);
router.post("/followUser", followUser);
router.post("/changePassword", changePassword);
router.post("/verifyAccount", verifyAccount);
router.get("/getusers", getUsers);
router.get("/getfollowers", getFollowers);
router.get("/userDetails", getUserDetails);
router.get("/getpostuser", getUser);
router.get("/getFollowing", getFollowing);
router.post("/unfollow", unfollowUser);
router.post("/newprofilepic", upload.single("media"), setProfilePic)
router.get("/profilepic", profilePic)

module.exports = router