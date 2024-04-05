const mongoose = require("mongoose")


const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://img.freepik.com/free-photo/blogging-gone-viral-camera-concept_53876-127618.jpg?w=740&t=st=1711021399~exp=1711021999~hmac=c75c01191f13a0ef37a51b8c539d62e19651c539a0fd148a698e40419511ef98"
    },
    category: {
        type: String,
        default: "uncategorized"
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
}, {timestamps: true})

const Post = mongoose.model("Post", postSchema)

module.exports = Post