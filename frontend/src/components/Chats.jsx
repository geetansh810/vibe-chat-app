import React, { useEffect } from 'react'
import groupImage from '../images/group.png'
import { useSelector } from 'react-redux'

const Chats = ({ selectChat }) => {
    const { chats, selectedChat, userDetails } = useSelector((state) => state.user)

    const convertDate = (givenDate) => {
        var date = new Date(givenDate)
        // var curr = new Date()
        // console.log(curr.toLocaleTimeString() + " " + date.toLocaleTimeString());
        // console.log(date.getDate() + " " + date.toLocaleString('default', { month: 'long' }) + " " + date.getFullYear() + " " + date.toLocaleTimeString())
        const lastTime = date.toLocaleTimeString().split(":")[0] + ":" + date.toLocaleTimeString().split(":")[1];
        return lastTime
    }

    useEffect(() => {
        console.log("Chats Updated");
    }, [chats])

    return (
        chats.map((chat, i) => {
            return (
                <div className={`msg online " + ${selectedChat ? selectedChat._id === chat._id ? "active" : "" : ""} `} key={i} onClick={() => { selectChat(chat) }}>
                    <img className="msg-profile" src={chat.isGroupChat ? groupImage :
                        chat.users[chat.users.length - 1]._id === userDetails._id ?
                            chat.users[0]["photo"]
                            :
                            chat.users[1]["photo"]
                    } alt="" />
                    <div className="msg-detail">
                        <div className="msg-username">{
                            chat.isGroupChat ? chat.chatName :
                                chat.users[chat.users.length - 1]._id === userDetails._id ?
                                    chat.users[0]["firstName"] + " " + chat.users[0]["lastName"]
                                    :
                                    chat.users[1]["firstName"] + " " + chat.users[1]["lastName"]
                        }</div>
                        <div className="msg-content">
                            <span className="msg-message me-1 text-primary">{chat.latestMessage && chat.latestMessage.sender._id === userDetails._id ? <i className="fa-solid fa-check"></i> : ""}</span>
                            <span className="msg-message">{chat.latestMessage ? chat.latestMessage.content.slice(0, 20) + "..." : "Let's vibe"}</span>
                            <span className="msg-date ">{convertDate(chat.updatedAt)}</span>
                        </div>
                    </div>
                </div>
            )

        })
    )
}

export default Chats