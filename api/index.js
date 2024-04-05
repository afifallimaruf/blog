const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const userRoutes = require("./routes/user.route")
const authRoutes = require("./routes/auth.route")
const postRoutes = require("./routes/post.route")
const commentRoutes = require("./routes/comment.route")

dotenv.config()

mongoose.connect("mongodb://localhost:27017/", {
    dbName: "mern-blog"
}).then(()=> {
    console.log("Database connected!")
}).catch((err)=> {
    console.log(err)
})

const app = express()

const corsOptions = {
    // set origin to a specific origin.
    origin: 'http://localhost:5173',
    
    // or, set origin to true to reflect the request origin
    //origin: true,

    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser())

app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/post", postRoutes)
app.use("/api/comment", commentRoutes)

app.use((err, req, res, next)=> {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'

    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})


app.listen(4000, ()=> {
    console.log("Server running at port 4000")
})