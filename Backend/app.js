//Defining this piece of code as an express app
const express = require("express")
const app = express()

//Getting all my value from my .env file
require("dotenv").config()
const port = process.env.PORT
const uri = process.env.MONGOURI
const secret = process.env.SECRET

//Getting the Dependencies
const session = require("express-session");
const MongoStore = require("connect-mongo")
const cors = require("cors")
const cookieParser = require("cookie-parser")

//Connecting all the required files to the app
const connectDB = require("./config/connectDb")
const authRoutes = require("./routes/authRoutes")
const postRoutes = require("./routes/postRoutes")



app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
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
