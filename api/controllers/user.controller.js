const User = require("../models/user.model")
const errorHandler = require("../utils/error")
const bcryptjs = require("bcryptjs")


const updateUser = async(req, res, next)=> {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, "You are not allowed to update this user"))
    }

    if (req.body.password) {
        if (req.body.password.length < 5 ) {
            return next(errorHandler(400, "Password must be at least 5 characters"))
        }

        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }

    if (req.body.username) {
        if (req.body.username.length < 5 || req.body.username.length > 10) {
            return next(errorHandler(400, "username must be between 5 and 10 characters"))
        }

        if (req.body.username.includes(' ')){
            return next(errorHandler(400, "username cannot contain spaces"))
        }

        if (!req.body.username.toLowerCase()) {
            return next(errorHandler(400, "username must be lowercase"))
        }

        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, "username can only contain letters and numbers"))
        }
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password
            }
        }, {new: true})
        const {password, ...rest} = updatedUser._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

const deleteUser = async(req, res, next)=> {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
        return next(errorHandler(403, "You are not allowed to delete this user"))
    }

    try {
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json("User has been deleted")
    } catch (error) {
        next(error)
    }
}

const signOut = async(req, res, next)=> {
    try {
        res.clearCookie("token").status(200).json("User has been sign out")
    } catch (error) {
        next(error)
    }
}

const getUsers = async(req, res, next)=> {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to see all users"))
    }

    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9
        const sortDirection = req.query.sort === 'asc' ? 1 : -1

        const users = await User.find()
        .sort({createdAt: sortDirection})
        .skip(startIndex)
        .limit(limit)

        const userWithoutPass = users.map((user)=> {
            const { password, ...rest } = user._doc
            return rest
        })

        const totalUsers = await User.countDocuments()

        const now = new Date()

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )

        const totalUsersLastMonth = await User.countDocuments({
            createdAt: {$gte: oneMonthAgo}
        })

        res.status(200).json({
            users: userWithoutPass,
            totalUsers,
            totalUsersLastMonth
        })
    } catch (error) {
        next(error)
    }
}

const getUser = async(req, res, next)=> {
    try {
        const user = await User.findById(req.params.userId)
        if (!user) {
            return next(errorHandler(404, "User not found!"))
        }

        const { password, ...rest } = user._doc
        res.status(200).json(rest)

    } catch (error) {
        next(error)
    }
}

module.exports = { updateUser, deleteUser, signOut, getUsers, getUser }