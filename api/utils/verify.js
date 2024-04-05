const jwt = require("jsonwebtoken")
const errorHandler = require("./error")

const verifyToken = (req, res, next)=> {
    const token = req.cookies.token
    if (!token) {
        return next(errorHandler(401, "Unauthorized"))
    }

    jwt.verify(token, process.env.JWT_KEY, (err, user)=> {
        if (err) {
            return next(errorHandler(403, "Token is not valid"))
        }

        req.user = user
        next()
    })
}

module.exports = { verifyToken }