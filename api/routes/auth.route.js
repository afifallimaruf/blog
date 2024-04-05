const { signUp, signIn, googleAuth } = require("../controllers/auth.controller")

const router = require("express").Router()

router.post("/sign-up", signUp)
router.post("/sign-in", signIn)
router.post("/google-auth", googleAuth)

module.exports = router