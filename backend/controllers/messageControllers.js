const asyncHandler = require('express-async-handler');
const Message = require('../models/message');
const User = require('../models/user');
const Chat = require('../models/chat');

exports.sendMessage = asyncHandler(async (req, res) => {

    const { chatId, content } = req.body;

    if (!chatId || !content) {
        return res.status(400).send("Invalid data passed");
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }

    try {
        var message = await Message.create(newMessage);
        message = await message.populate("sender", "-encry_password -salt");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "firstName lastName mobileNumber email"
        })
        message = await Message.populate(message, {
            path: "chat.latestMessage"
        })

        message = await User.populate(message, {
            path: "chat.latestMessage.sender",
            select: "firstName lastName mobileNumber email"
        })

        // var ch = await Chat.findByIdAndUpdate(chatId, {
        //     latestMessage: message
        // });

        // var ch = await Message.populate(message.latestMessage)

        // console.log(ch);

        return res.json(message)
    }
    catch (e) {
        res.status(400).send("Message not sent")
    }

})

exports.allMessages = asyncHandler(async (req, res) => {
    // console.log(req.params.chatId);
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "firstName lastName photo email mobileNumber")
            .populate("chat")

        // console.log(messages);
        return res.json(messages)
    } catch (err) {
        return res.status(400).send(err)
    }
})