import React, { useState } from 'react'
// import ChatProvider from '../context/ChatProvider'
import ScrollableFeed from 'react-scrollable-feed'
import ChatMsg from './subcomponents/ChatMsg'
import ChatMsgOwner from './subcomponents/ChatMsgOwner'
import typingImage from '../images/typing.gif'
import sent from '../images/send-message.png'
import { useSelector } from 'react-redux'

const Conversation = ({ messages, isTyping, send, typingHandler, goToPage }) => {

    const { selectedChat, userDetails } = useSelector((state) => state.user)
    const [senderMsg, setSenderMsg] = useState();

    const keyPress = (key) => {
        if (key.code === "Enter") {
            send(senderMsg)
            setSenderMsg("")
        }
    }

    const inputChange = (value) => {
        setSenderMsg(value)
        typingHandler(true)
    }

    return (
        <div className="chat-area" id="chatArea">
            <div className="chat-area-header">
                {
                    (window.innerWidth <= 780) &&
                    <div className='btn' onClick={() => goToPage("chats")}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </div>
                }
                <div className="chat-area-title"
                    style={{ cursor: "pointer" }}
                >{
                        selectedChat.isGroupChat ? selectedChat.chatName :
                            selectedChat.users[0]._id === userDetails._id ?
                                selectedChat.users[1].firstName + " " + selectedChat.users[1].lastName
                                :
                                selectedChat.users[0].firstName + " " + selectedChat.users[0].lastName
                    }
                </div>
                <div className="chat-area-group" onClick={() => goToPage("details")}>
                    {
                        selectedChat.isGroupChat ?
                            <>
                                {
                                    selectedChat.users.map((user, i) => {
                                        if (i < 3)
                                            return < img className="chat-area-profile" src={user.photo} alt="" key={i} />
                                        return <span className="chat-area-profile my-auto p-3">+ {selectedChat.users.length - 3}</span>
                                    })
                                }
                            </>
                            :
                            selectedChat.users[0]._id === userDetails._id ?
                                < img className="chat-area-profile" src={selectedChat.users[1].photo} alt="" />
                                :
                                < img className="chat-area-profile" src={selectedChat.users[0].photo} alt="" />

                    }
                </div>
            </div>
            <ScrollableFeed>
                <div className="chat-area-main mb-5">
                    {
                        messages.length < 1 ?
                            <div className="d-flex align-items-center my-5 py-5">
                                <h3 className='text-center m-auto text-secondary'><i className="fa-solid fa-ghost me-5"></i>Start your conversation<i className="fa-solid fa-ghost ms-5"></i></h3>
                            </div>
                            :
                            <>
                                {
                                    messages.map((msg) => {

                                        if (msg.sender._id === userDetails._id)
                                            return <ChatMsgOwner msg={msg} key={msg._id} />

                                        return <ChatMsg msg={msg} key={msg._id} />
                                    })
                                }
                                {
                                    isTyping &&
                                    <div className='typing-loader ms-4'>
                                        typing
                                        <img src={typingImage} alt='' width={'30px'} height={'30px'} className='ms-2' />
                                    </div>
                                }
                            </>
                    }
                </div>
            </ScrollableFeed>
            <div className="chat-area-footer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-video">
                    <path d="M23 7l-7 5 7 5V7z" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-image">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" /></svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v8M8 12h8" /></svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-paperclip">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" /></svg>
                <input type="text" placeholder="Type something here..." value={senderMsg} onChange={(e) => inputChange(e.target.value)} onKeyDown={(e) => { keyPress(e) }} />
                <button className='btn' onClick={() => send(senderMsg)}>
                    <img src={sent} width={30} alt='Enter' />
                </button>
            </div>
        </div>
    )
}

export default Conversation