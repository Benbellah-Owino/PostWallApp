//Defining this piece of code as an express app
const express = require("express")
const app = express()
const path = require("path")
//Getting all my value from my .env file
require("dotenv").config()
const port = process.env.PORT
const uri = process.env.MONGOURI
const secret = process.env.SECRET

const isAuth = require("./middleware/isAuth")
//Getting the Dependencies
const session = require("express-session");
const MongoStore = require("connect-mongo")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const Media = require("./models/mediaModel")

//multer setup
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads")
    },
    filename: async (req, file, cb) => {
        const { userName } = await isAuth(req)
        console.log(file);
        let name = file.originalname
        name = name.split(".")[0]

        let user = userName.split(" ")[0];
        cb(null, "postwall" + + Date.now() + user + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

//Connecting all the required files to the app
const connectDB = require("./config/connectDb")
const authRoutes = require("./routes/authRoutes")
const postRoutes = require("./routes/postRoutes")


app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(cors({ credentials: true, origin: true }))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", 'http://localhost:5173');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});
const sessionStore = new MongoStore({
    mongooseConnection: connectDB(uri),
    mongoUrl: uri,
    collection: "sessions"
})

app.use(session({
    secret: secret,
    saveUninitialized: true,
    resave: false,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 3
    }
}))

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/post", postRoutes)

app.get("/", (req, res) => {
    res.cookie("ben", "lmao")
    res.send(`<h1>Hello there user</h1>`)
})

app.post("/api/v1/addMedia", upload.single("media"), async (req, res) => {
    console.log("sent")
    const filename = req.file.filename;
    console.log('File saved as:', filename);
    let post_id = req.query.id

    let { userId } = await isAuth(req)

    let media = await Media.create({
        post: post_id,
        fileName: filename,
        postedBy: userId
    })

    console.log(media)

    res.status(200).json({ msg: "Media Added Succesfully" })
})

// app.post("/newprofilepic", upload.single("media"), async (req, res) => {
//     try {
//         console.log("sent")
//         const filename = req.file.filename;
//         console.log('File saved as:', filename);

//         let { userId } = await isAuth(req)

//         let media = await ProfilePic.create({
//             fileName: filename,
//             postedBy: userId
//         })

//         console.log(media)

//         res.status(201).json({ msg: "Profile pic Added Succesfully" })
//     } catch (error) {
//         console.log(`controllers > user.js> setProfilePic > 80 : \n ${error}`)
//         res.status(500)
//     }
// })


app.get("/getCookie", (req, res) => {
    console.log(req.cookies)
    res.send(req.cookies)
})

app.listen(port, () => {
    try {
        console.log(`Server is listening on port ${port}`)
    } catch (error) {
        console.log(error)
    }
})
