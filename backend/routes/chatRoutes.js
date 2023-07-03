const express = require('express');
const { accessChats, fetchChats, createGroupChat, renameGroupChat, removeUserFromGroupChat, addUserToGroupChat, getChat } = require('../controllers/chatControllers');
const { protect } = require('../middlewares/authMiddleware')

const router = express.Router();

router.post("/", protect, accessChats);
router.get("/:chatId", protect, getChat);
router.get("/", protect, fetchChats);
router.post("/group", protect, createGroupChat);
router.put("/group/rename", protect, renameGroupChat);
router.put("/group/add", protect, addUserToGroupChat);
router.put("/group/remove", protect, removeUserFromGroupChat);

module.exports = router;