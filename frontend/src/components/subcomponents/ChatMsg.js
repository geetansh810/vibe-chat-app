import React from 'react'

const ChatMsg = ({ msg }) => {
    const convertDate = (givenDate) => {
        var date = new Date(givenDate)
        return date.toLocaleString()
    }

    return (
        <div className="chat-msg">
            <div className="chat-msg-profile">
                <img className="chat-msg-img" src={msg.sender.photo} alt="" />
                <div className="chat-msg-date">Message sent {convertDate(msg.createdAt)}</div>
            </div>
            <div className="chat-msg-content">
                <div className="chat-msg-text">{msg.content}</div>
                {/* <div className="chat-msg-text">
                    <img src="https://media0.giphy.com/media/yYSSBtDgbbRzq/giphy.gif?cid=ecf05e47344fb5d835f832a976d1007c241548cc4eea4e7e&rid=giphy.gif" /></div>
                <div className="chat-msg-text">Neque gravida in fermentum et sollicitudin ac orci phasellus egestas. Pretium lectus quam id leo.</div> */}
            </div>
        </div>
    )
}

export default ChatMsg