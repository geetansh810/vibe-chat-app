import React, { useEffect, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { setUserDetails, setChats, setNotification, setSelectedChat, setMessages } from '../features/userSlice'

import MenuBar from '../components/MenuBar'
import { isAuthenticated } from '../apiCalls/authApis'
import { getAllMessages, sendMessage } from '../apiCalls/messageApis'
import { accessNewChat, addUsersToGroupChat, createGroupChat, getAllChats, removeUserFromGroupChat, renameGroupChat } from '../apiCalls/chatApis'
// import { ChatState } from '../context/ChatProvider'
import { toast } from 'react-toastify';
import ConversationDetails from '../components/ConversationDetails'
import Conversation from '../components/Conversation'
import Chats from '../components/Chats'
import Lottie from 'lottie-react'
import hamster from '../images/Hamster.json'
import plus from '../images/chat-white.png'
import io from 'socket.io-client'
import Modals from '../components/Modals'

// const ENDPOINT = "http://localhost:5000"
const ENDPOINT = "https://vibe-chat-app.onrender.com"
var socket, selectedChatCompare;




const Home = ({ loader }) => {
    const { user, token } = isAuthenticated()

    const { userDetails, selectedChat, notification, chats, messages } = useSelector((state) => state.user)
    const dispatch = useDispatch()

    // console.log(userDetails);

    const [loading, setLoading] = useState(true)
    const [socketConnected, setSocketConnected] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [typing, setTyping] = useState(false)
    const [chatMessages, setChatMessages] = useState([])

    const [showChats, setShowChats] = useState(true)
    const [showConversation, setShowConversation] = useState(true)
    const [showDetails, setShowDetails] = useState(true)

    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit("setup", user)
        socket.on("connected", () => setSocketConnected(true))
    }, [])

    useEffect(() => {
        // console.log("useeffect");
        socket.on("typing", () => setIsTyping(true))
        socket.on("stop typing", () => setIsTyping(false))

        socket.on("message recieved", (newMessageRecieved) => {
            // console.log("New meessage");
            // console.log(selectedChatCompare);
            // console.log(newMessageRecieved.chat._id);
            // console.log(selectedChat._id);

            if (newMessageRecieved.chat._id !== undefined) {

                if (selectedChat._id !== newMessageRecieved.chat._id) {
                    //give notification
                    if (!notification.includes(newMessageRecieved)) {
                        // console.log(newMessageRecieved);
                        dispatch(setNotification([newMessageRecieved, ...notification]))

                        getAllChats(token).then((data) => {
                            // console.log("hello");
                            dispatch(setChats(data));
                            // console.log(data);
                        })
                    }
                }
                else {
                    // console.log(newMessageRecieved);
                    setChatMessages([...chatMessages, newMessageRecieved])
                    dispatch(setMessages([...messages, newMessageRecieved]))
                }


            }


        })
    })



    useEffect(() => {
        checkDarkMode()
        console.log(user);
        dispatch(setUserDetails(user))
        allChats()
    }, [])

    useEffect(() => {
        console.log(selectedChat);
    }, [selectedChat, token])


    const checkDarkMode = () => {
        if (localStorage.getItem("theme") === "dark")
            document.body.classList.add('dark-mode');
    }

    const allChats = async () => {
        await getAllChats(token).then((data) => {
            dispatch(setChats(data));
            // console.log(data);
        })
    }

    const selectChat = async (chat) => {

        goToPage("conversation")

        const filterNotifications = notification.filter((noti) => {
            return noti.chat._id !== chat._id
        })

        dispatch(setNotification(filterNotifications))

        dispatch(setSelectedChat(chat))
        setLoading(true);
        await getAllMessages(token, chat._id).then((data) => {
            // console.log(data);
            setChatMessages(data)
            dispatch(setMessages(data));
            setChatMessages(data)
            setLoading(false);
            socket.emit("join chat", chat._id)
        })

        selectedChatCompare = chat
    }

    function typingHandler(typing) {
        if (!socketConnected) return;
        // console.log("typing");
        if (typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime()
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime

            if (timeDiff > timerLength && typing) {
                socket.emit("stop typing", selectedChat._id)
                setTyping(false)
            }
        }, timerLength)
    }

    function send(senderMsg) {
        console.log("Sent");
        // console.log(senderMsg);
        if (senderMsg.length === 0) {
            toast("Enter some text")
            return;
        }
        sendMsg(senderMsg)
    }

    async function sendMsg(senderMsg) {
        socket.emit("stop typing", selectedChat._id)
        // console.log(senderMsg);
        await sendMessage(token, selectedChat._id, senderMsg).then((data) => {
            // console.log(data);
            const newMessages = [...messages, data]
            setChatMessages(newMessages)
            dispatch(setMessages(newMessages))
            // console.log(messages);
            socket.emit("new message", data)
        })
    }

    const newChat = async (userId) => {
        loader(true);
        await accessNewChat(token, userId).then((data) => {
            loader(false)
            console.log(data);
            console.log(chats);
            const existingChat = chats.filter((chat) => {
                return chat._id === data._id
            })
            console.log(existingChat);
            dispatch(setSelectedChat(existingChat[0]))
            selectChat(existingChat)
        })
    }

    const changeGrpName = (grpName) => {
        // loader(true)
        renameGroupChat(token, grpName, selectedChat._id).then((data) => {
            // loader(false)
            console.log(data);
            dispatch(setSelectedChat(data));

            const newChats = chats.filter((ch) => {
                return ch._id !== data._id
            })

            newChats.unshift(data)
            console.log(newChats);
            dispatch(setChats(newChats))
        })
    }

    const addParticipants = (groupMembers) => {

        const membersToAdd = groupMembers.map((mem) => {
            return mem._id
        })

        console.log(membersToAdd);
        addUsersToGroupChat(token, selectedChat._id, groupMembers).then((data) => {
            dispatch(setSelectedChat(data))
            console.log(data);
        })
    }

    const removeParticipant = (id) => {

        if (selectedChat.groupAdmin._id !== userDetails._id) {
            toast("Only admins can remove members")
            return
        }

        removeUserFromGroupChat(token, selectedChat._id, id).then((data) => {
            console.log(data);
            dispatch(setSelectedChat(data))
        })
    }


    const createNewGroupChat = (groupMembers, groupName) => {
        loader(true)
        createGroupChat(token, groupMembers, groupName).then((data) => {
            loader(false)
            console.log(data);
            if (data.error) {
                toast(data.error)
                return
            }
            dispatch(setChats([...chats, data]))
            dispatch(setSelectedChat(data));

        }).catch(err => {
            console.log(err);
            loader(false)
            // toast(err)
        })
    }


    function goToPage(pageName) {
        console.log("Page:" + pageName);

        // setShowChats(false)
        // setShowDetails(false)
        // setShowConversation(true)

        if (window.innerWidth <= 780) {

            switch (pageName) {
                case "chats":
                    setShowChats(true)
                    setShowDetails(false)
                    setShowConversation(false)
                    break;

                case "conversation":
                    setShowChats(false)
                    setShowDetails(false)
                    setShowConversation(true)
                    break;

                case "details":
                    setShowChats(false)
                    setShowConversation(false)
                    setShowDetails(true)
                    break;

                default:
                    break;
            }

            console.log("chats:" + showChats);
            console.log("conversation:" + showConversation);
            console.log("details:" + showDetails);
        }

    }

    useEffect(() => {
        console.log("chats:" + showChats);
        console.log("conversation:" + showConversation);
        console.log("details:" + showDetails);
    }, [showChats, showConversation, showDetails])

    // //chatPage
    // // console.log(notification);


    // //grpDetails
    // const [users, setUsers] = useState([]);
    // const [searchText, setSearchText] = useState("");


    // useEffect(() => {
    //     console.log(selectedChat);
    // }, [selectedChat])



    // const getUser = (key) => {
    //     setSearchText(key)
    //     findUser(token, key).then((data) => {
    //         if (data.length > 0) {
    //             setUsers(data)
    //             // console.log(data);
    //         }
    //     })
    // }
    // const removeMember = (member) => {
    //     const res = groupMembers.filter((mem) => {
    //         return mem != member
    //     })
    //     setGroupMembers(res)
    // }


    return (
        <div className='app'>
            <MenuBar selectChat={selectChat} />
            <div className="wrapper">

                {
                    showChats && (
                        <div className="conversation-area">
                            <div className="search-bar">
                                <input type="text" placeholder="Search..." />
                            </div>
                            <div>
                                {
                                    chats && (
                                        <Chats selectChat={selectChat} />
                                    )
                                }
                            </div>
                            <button className="add" data-bs-toggle="modal" data-bs-target="#newChatModal">
                                <img src={plus} alt='add' className='w-100' />
                            </button>
                            <div className="overlay"></div>
                        </div>
                    )
                }


                {
                    Object.keys(selectedChat).length !== 0 ?
                        <>
                            {
                                showConversation &&

                                    loading ?
                                    <div className='dummy-box m-auto w-100'>
                                        <h5 className='text-center mt-5 mb-0'>Loading your chats ...</h5>
                                        <Lottie animationData={hamster} />
                                    </div>
                                    :
                                    <Conversation messages={chatMessages} isTyping={isTyping} send={send} typingHandler={typingHandler}
                                        goToPage={goToPage} />
                            }
                            {
                                showDetails && (
                                    <ConversationDetails removeParticipant={removeParticipant}
                                        goToPage={goToPage} />
                                )
                            }
                        </>
                        :
                        <h3 className='text-center m-auto text-secondary'>No chat selected</h3>
                }
            </div>
            <Modals
                newChat={newChat}
                changeGrpName={changeGrpName}
                addParticipants={addParticipants}
                createNewGroupChat={createNewGroupChat}
            />
        </div >
    )
}

export default Home