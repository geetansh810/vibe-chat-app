import React from 'react'

const ChatMsgOwner = ({ msg }) => {
    // console.log(msg);

    const convertDate = (givenDate) => {
        var date = new Date(givenDate)
        return date.toLocaleString()
    }

    return (
        <div className="chat-msg owner">
            <div className="chat-msg-profile">
                {/* <img className="chat-msg-img" src={msg.sender.photo} alt="" /> */}
                <div className="chat-msg-date">Message sent {convertDate(msg.createdAt)}</div>
            </div>
            <div className="chat-msg-content">
                <div className="chat-msg-text">{msg.content}</div>
            </div>
        </div>

    )
}

export default ChatMsgOwner