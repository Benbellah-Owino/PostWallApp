const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser")
const cors = require("cors")
const { getUsers, getUser, getFollowers, createUser, loginUser, logout, refresh, blockAccount, blockUser, followUser, changePassword, verifyAccount, getUserDetails } = require("../controllers/user");

router.use(cookieParser())


router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.post("/blockAccount", blockAccount);
router.post("/blockUser", blockUser);
router.post("/followUser", followUser);
router.post("/changePassword", changePassword)
router.post("/verifyAccount", verifyAccount);
router.get("/getusers", getUsers)
router.get("/getfollowers", getFollowers)
router.get("/userDetails", getUserDetails)
router.get("/getpostuser", getUser)

module.exports = router