const express = require("express");
const { getAllUsers, getUserProfile, findUser } = require("../controllers/userControllers");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware")

router.get("/profile/:userId", protect, getUserProfile)
router.get('/users', protect, getAllUsers)
router.get('/user', protect, findUser)

module.exports = router;

