const { updateUser, deleteUser, signOut, getUsers, getUser } = require("../controllers/user.controller")
const { verifyToken }  = require("../utils/verify")

const router = require("express").Router()


router.put("/update/:userId", verifyToken, updateUser)
router.delete("/delete/:userId", verifyToken, deleteUser)
router.post("/sign-out", signOut)
router.get("/getusers", verifyToken, getUsers)
router.get("/:userId", getUser)

module.exports = router