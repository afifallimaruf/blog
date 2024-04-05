const bcryptJs = require("bcryptjs")
const User = require("../models/user.model")
const errorHandler = require("../utils/error")
const jwt = require("jsonwebtoken")

const signUp = async(req, res, next)=> {
    const { username, email, password } = req.body

    const hashedPassword = bcryptJs.hashSync(password, 10)

    if (!username || !email || !password || username === "" || email === "" || password === "") {
        next(errorHandler(400, "All fields are required"))
    }

    const userSaved = new User({
        username,
        email,
        password: hashedPassword
    })

    try {
        await userSaved.save()
        res.status(200).json("signup successful")
    } catch (error) {
        next(error)
    }
}

const signIn = async(req, res, next)=> {
    const { email, password } = req.body

    if (!email || !password || email === "" || password === "") {
        return next(errorHandler(400, "All fields are required"))
    }

    try {
        const user = await User.findOne({email})
        if (!user) {
            next(errorHandler(401, "Authentication failed"))
        }

        const validPassword = bcryptJs.compareSync(password, user.password)
        if (!validPassword) {
            next(errorHandler(401, "Authentication failed"))
        } else {
            const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_KEY)
            res.cookie("token", token, {
                httpOnly: true
            })
            const {password, ...rest} = user._doc
            res.status(200).json(rest)
        }

    } catch (error) {
        next(errorHandler(error))
    }
}

const googleAuth = async(req, res, next)=> {
    const { email, name, photoUrl } = req.body

    if (!email || !name || !photoUrl) {
        return next(errorHandler(400, "All fields are required"))
    }

    try {
        const user = await User.findOne({email})

        if (user) {
            const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_KEY)

            const {password, ...rest} = user._doc

            res.cookie("token", token, {
                httpOnly: true
            })

            res.status(200).json(rest)
        } else {
            const generatePassword = Math.random().toString(36).slice(-8) +  Math.random().toString(36).slice(-8)
            const hashedPassword = bcryptJs.hashSync(generatePassword, 10)

            const newUser = new User({
                username: name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: photoUrl
            })

            await newUser.save()
            const token = jwt.sign({id: newUser._id, isAdmin: user.isAdmin}, process.env.JWT_KEY)

            const {password, ...rest} = newUser._doc

            res.cookie("token", token, {
                httpOnly: true
            })
            res.status(200).json(rest)

            res.cookie()
        }
    } catch (error) {
        next(errorHandler(error))
    }
}

module.exports = { signUp, signIn, googleAuth }