const asyncHandler = require('express-async-handler');
const Chat = require('../models/chat');
const User = require('../models/user');


exports.accessChats = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        // console.log("UserId param not sent with request");
        return res.status(400).json({ error: "UserId param not sent with request" });
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "firstName lastName photo email mobileNUmber",
    });

    if (isChat.length > 0) {
        // console.log(isChat);
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-encry_password -salt"
            );
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

exports.getChat = asyncHandler(async (req, res) => {
    const { chatId } = req.params;

    try {
        Chat.findById(chatId)
            .populate("users", "-encry_password -salt")
            .populate("groupAdmin", "-encry_password -salt")
            .populate("latestMessage")
            .then(
                async (chat) => {
                    chat = await User.populate(chat, {
                        path: "latestMessage.sender",
                        select: "firstName lastName email mobileNumber photo"
                    })
                    return res.status(200).send(chat);
                }
            )
    }
    catch (error) {
        // console.log(error);
        return res.status(500).send(error);
    }
})

exports.fetchChats = asyncHandler(async (req, res) => {

    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-encry_password -salt")
            .populate("groupAdmin", "-encry_password -salt")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(
                async (chats) => {
                    chats = await User.populate(chats, {
                        path: "latestMessage.sender",
                        select: "firstName lastName email mobileNumber photo"
                    })
                    return res.status(200).send(chats);
                }
            )
    }
    catch (error) {
        // console.log(error);
        return res.status(500).send(error);
    }

})

exports.createGroupChat = asyncHandler(async (req, res) => {

    const { users } = req.body;

    if (users.length < 2) {
        return res.status(400).json({ error: "More than 2 users are required for group chat" })
    }

    if (!req.body.chatName) {
        return res.status(400).send("Please provide the name for the group chat")
    }

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.chatName,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user
        })

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-encry_password -salt")
            .populate("groupAdmin", "-encry_password -salt")

        res.status(200).json(fullGroupChat)
    }
    catch (err) {
        // console.log(error);
        return res.status(500).send(error);
    }

})

exports.renameGroupChat = asyncHandler(async (req, res) => {

    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId, { chatName }, { new: true }
    )
        .populate("users", "-encry_password -salt")
        .populate("groupAdmin", "-encry_password -salt")
        .populate("latestMessage")

    if (!updatedChat) {
        return res.status(400).send("Chat not found")
    }

    return res.status(200).send(updatedChat)

})

exports.addUserToGroupChat = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId, { $push: { users: userId } }, { new: true }
    )
        .populate("users", "-encry_password -salt")
        .populate("groupAdmin", "-encry_password -salt")

    if (!updatedChat) {
        return res.status(400).send("Chat not found")
    }

    return res.status(200).send(updatedChat)

})

exports.removeUserFromGroupChat = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId, { $pull: { users: userId } }, { new: true }
    )
        .populate("users", "-encry_password -salt")
        .populate("groupAdmin", "-encry_password -salt")

    if (!updatedChat) {
        return res.status(400).send("Chat not found")
    }

    return res.status(200).send(updatedChat)

})
