//chatName
//isGroupChat
//users
//latestMessage
//groupAdmin

const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const chatSchema = new mongoose.Schema(
    {
        chatName: {
            type: String,
            trim: true
        },

        isGroupChat: {
            type: Boolean,
            default: false
        },

        users: [{
            type: ObjectId,
            ref: "User"
        }],

        latestMessage: {
            type: ObjectId,
            ref: "Message"
        },

        groupAdmin: {
            type: ObjectId,
            ref: "User"
        }

    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Chat", chatSchema);