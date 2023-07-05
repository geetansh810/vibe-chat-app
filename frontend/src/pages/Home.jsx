import React, { useEffect, useRef, useState } from 'react'

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
import NewWindow from 'react-new-window'
import IncomingCall from '../components/IncomingCall'

import { Modal } from 'react-responsive-modal';
import Peer from "simple-peer"
import callRing from '../sounds/callRing.mp3'
import hangUp from '../images/hangUp.png'
import hangOn from '../images/hangOn.json'
import bootstrapMin from 'bootstrap/dist/js/bootstrap.min'

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

    const [showVideo, setShowVideo] = useState(false)

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
            if (existingChat.length === 0) {
                dispatch(setChats([data, ...chats]))
            }
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
            dispatch(setChats([data, ...chats]))
            dispatch(setSelectedChat(data));

        }).catch(err => {
            console.log(err);
            loader(false)
            // toast(err)
        })
    }


    //video Call

    const [me, setMe] = useState("")
    const [stream, setStream] = useState()
    const [receivingCall, setReceivingCall] = useState(false)
    const [caller, setCaller] = useState("")
    const [callerSignal, setCallerSignal] = useState()
    const [callAccepted, setCallAccepted] = useState(false)
    const [idToCall, setIdToCall] = useState("")
    const [callEnded, setCallEnded] = useState(false)
    const [name, setName] = useState("")
    const [requestCall, setRequestCall] = useState(false)
    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef()

    useEffect(() => {
        socket.on("callUser", (data) => {
            console.log("Some one is calling you");
            document.getElementById('incomingAudio').click()

            var incomingCallModal = new bootstrapMin.Modal(document.getElementById('incomingCallModal'), {
                keyboard: false
            })
            incomingCallModal.show()


            setReceivingCall(true)
            setCaller(data.from)
            setName(data.name)
            setCallerSignal(data.signal)
        })
    })

    const getUserMedia = async () => {

        if (!navigator || !navigator.mediaDevices) return;

        return await navigator.mediaDevices
            .getUserMedia({ audio: true, video: true })
            .then((stream) => {
                console.log("Media Enabled");
                setStream(stream)
                myVideo.current.srcObject = stream
                return true
            }).catch((err) => {
                console.log(err);
                toast("You denied the Camera/Mic access!! Please provide the permission.")
                return false;
            })

    }

    // useEffect(() => {
    //     console.log("outside");
    //     if (myVideo.current !== undefined && showVideo) {
    //         console.log("inside");
    //         myVideo.current.srcObject = stream
    //     }
    // })

    // var videoModal = document.getElementById('videoCallModal')
    // // console.log(videoModal);
    // useEffect(() => {
    //     if (videoModal !== null) {
    //         console.log("hello");
    //         videoModal.addEventListener('hidden.bs.modal', function () {
    //             // setShowVideo(false)
    //             console.log(stream);
    //             // stream.getTracks().forEach(function (track) {
    //             //     track.stop();
    //             // });
    //         })
    //     }

    // }, [videoModal])

    const endVideo = () => {
        console.log("End call");
        stream.getTracks().forEach(function (track) {
            track.stop();
        });
        leaveCall()
    }

    const callUser = async (id, me, name) => {
        console.log(id, me, name);

        const mediaPermission = await getUserMedia()
        if (!mediaPermission) {
            return;
        }
        setShowVideo(true)

        var videoCallModal = new bootstrapMin.Modal(document.getElementById('videoCallModal'), {
            keyboard: false
        })
        videoCallModal.show()

        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        })
        peer.on("signal", (data) => {
            socket.emit("callUser", {
                userToCall: id,
                signalData: data,
                from: me,
                name: name
            })
        })
        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream
        })
        socket.on("callAccepted", (signal) => {
            console.log("User accecpted the call");
            setCallAccepted(true)
            peer.signal(signal)
        })

        connectionRef.current = peer
    }

    const answerCall = async () => {
        console.log("You accepted the call");
        setCallAccepted(true)
        setRequestCall(false)
        setShowVideo(true)

        const mediaPermission = await getUserMedia()
        if (!mediaPermission) {
            return;
        }
        setShowVideo(true)

        var incomingCallModal = new bootstrapMin.Modal(document.getElementById('incomingCallModal'), {
            keyboard: false
        })

        incomingCallModal.hide()

        var videoCallModal = new bootstrapMin.Modal(document.getElementById('videoCallModal'), {
            keyboard: false
        })
        videoCallModal.show()

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        })

        peer.on("signal", (data) => {
            socket.emit("answerCall", { signal: data, to: caller })
        })
        peer.on("stream", (stream) => {
            console.log(stream);
            userVideo.current.srcObject = stream
        })
        peer.signal(callerSignal)
        connectionRef.current = peer
    }

    const leaveCall = () => {
        console.log("Call ended");
        setCallEnded(true)
        connectionRef.current.destroy()
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

    const playIncomingAudio = () => {
        console.log('button clicked');
        const audio = new Audio(callRing)
        audio.addEventListener("canplaythrough", () => {
            audio.play().catch(e => {
                window.addEventListener('click', () => {
                    audio.play()
                })
            })
        });
    }

    const sayHello = () => {
        console.log("Hello");
    }

    const toggleVideo = () => {
        if (myVideo.current !== undefined && showVideo) {
            console.log("inside");
            myVideo.current.srcObject = stream
        }
    }

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
                                        goToPage={goToPage} callUser={callUser} />
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

            <div className="modal fade" id="incomingCallModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Video Call</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                onClick={endVideo}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className='incoming-call'>
                                <div className='mt-5 bg-light px-4 py-2 rounded'>
                                    <h5 className='fw-bolder'>
                                        Geetansh Agrawal
                                    </h5>
                                </div>
                                <div className="call-animation">
                                    <img className="img-circle" src={user.photo} alt="" width="135" />
                                </div>
                                <div className='pb-5 ps-5'>
                                    <button className='call-button btn btn-outline-danger bg-light rounded-pill mx-3 p-2' >
                                        <img src={hangUp} alt='hangup' />
                                    </button>
                                    <button className='call-button btn btn-light rounded-pill mx-3 incoming-btn mt-0' onClick={answerCall}>
                                        <Lottie animationData={hangOn} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='modal-footer'>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="videoCallModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Video Call</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                onClick={endVideo}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="fullscreen-media-container video">
                                <video ref={userVideo} autoPlay playsInline loop></video>
                                <div className="overlay-content-container">
                                    <div className="partner-text-container">
                                        <button className="call-button button-mic-element size-s">
                                            <span className="icon icon-mic-inactive">
                                                <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6 9.08786V9.08786C4.78197 9.08746 3.79467 8.10016 3.79428 6.88214V3.20571V3.20566C3.7947 1.98764 4.78202 1.00036 6.00005 1H6.00005C7.21807 1.00039 8.20537 1.98769 8.20576 3.20571V6.88214V6.8821C8.20618 8.09988 7.21931 9.08744 6.00152 9.08786C6.00103 9.08786 6.00054 9.08786 6.00005 9.08786L6 9.08786Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M11 7V7C11 9.76142 8.76142 12 6 12V12C3.23858 12 1 9.76142 1 7V7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M6 13.5V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                        </button>
                                        <span className="name">Geetansh Agrawal</span>
                                    </div>
                                    <div className="ui-container">
                                        <div className="navigation-controls-container">
                                            <button className="call-button button-settings me-3">
                                                <span></span>
                                            </button>

                                            <button className="call-button button-mic-element switch">
                                                <span className="icon icon-mic-active">
                                                    <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path className="active" fillRule="evenodd" clipRule="evenodd" d="M8.95576 3.20547C8.95523 1.57343 7.63209 0.250528 6.00004 0.25C4.368 0.250488 3.04484 1.57367 3.04428 3.20571V6.88238C3.04469 8.16353 4.10998 9.25418 5.25 9.6642V11.1317C3.38532 10.682 1.75 9.00277 1.75 7H0.25C0.25 9.92145 2.42874 12.334 5.25 12.7015V13.5C5.25 13.9142 5.58579 14.25 6 14.25C6.41421 14.25 6.75 13.9142 6.75 13.5V12.7015C9.57126 12.334 11.75 9.92144 11.75 7H10.25C10.25 9.00277 8.61468 10.682 6.75 11.1317V9.66461C7.89054 9.25478 8.95607 8.16336 8.95576 6.88184V3.20547ZM7.45576 6.88236C7.45604 7.68593 6.80386 8.33758 6.00029 8.33786C5.19637 8.3376 4.54467 7.68578 4.54428 6.8819V3.20566C4.5447 2.40186 5.19624 1.75036 6.00004 1.75C6.80385 1.75039 7.45537 2.40215 7.45576 3.20596V6.88236Z" fill="white" />
                                                        <path className="inactive" fillRule="evenodd" clipRule="evenodd" d="M6.00004 0.25C7.63209 0.250528 8.95523 1.57343 8.95576 3.20547V6.88184C8.95589 7.43109 8.76024 7.94543 8.4468 8.38614L9.42825 9.36759C9.9368 8.69098 10.25 7.87647 10.25 7H11.75C11.75 8.31745 11.3069 9.53141 10.5617 10.501L11.4298 11.3692C11.7227 11.6621 11.7227 12.1369 11.4298 12.4298C11.1369 12.7227 10.6621 12.7227 10.3692 12.4298L9.501 11.5617C8.71848 12.1631 7.7768 12.5678 6.75 12.7015V13.5C6.75 13.9142 6.41421 14.25 6 14.25C5.58579 14.25 5.25 13.9142 5.25 13.5V12.7015C2.42874 12.334 0.25 9.92145 0.25 7H1.75C1.75 9.00277 3.38532 10.682 5.25 11.1317V9.6642C4.10998 9.25418 3.04469 8.16353 3.04428 6.88238V5.10494L0.46967 2.53033C0.176777 2.23744 0.176777 1.76256 0.46967 1.46967C0.762563 1.17678 1.23744 1.17678 1.53033 1.46967L3.05201 2.99135C3.16233 1.45936 4.44008 0.250467 6.00004 0.25ZM4.54428 6.60494V6.8819C4.54467 7.68578 5.19637 8.3376 6.00029 8.33786C6.08714 8.33783 6.17223 8.33019 6.25491 8.31557L4.54428 6.60494ZM7.38688 7.32622L4.54428 4.48362V3.20566C4.5447 2.40186 5.19624 1.75036 6.00004 1.75C6.80385 1.75039 7.45537 2.40215 7.45576 3.20596V6.88236C7.45581 7.03714 7.43166 7.18628 7.38688 7.32622ZM7.33167 9.39233C7.14348 9.50189 6.94787 9.5935 6.75 9.66461V11.1317C7.3164 10.9951 7.86163 10.7451 8.3463 10.407L7.33167 9.39233Z" fill="white" />
                                                    </svg>
                                                </span>
                                            </button>
                                            <button className="call-button button-cam-element switch" onClick={() => { toggleVideo() }}>
                                                <span className="icon icon-cam-active">
                                                    <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path className="active" fillRule="evenodd" clipRule="evenodd" d="M10 8.6732V8.70915C10 9.95203 8.99288 10.9591 7.75 10.9591H2.5C1.25712 10.9591 0.25 9.95203 0.25 8.70915V4.04248C0.25 2.7996 1.25712 1.79248 2.5 1.79248H7.75C8.99288 1.79248 10 2.7996 10 4.04248V4.07807L11.3098 3.02401C12.2916 2.23343 13.75 2.93294 13.75 4.1923V8.55897C13.75 9.81849 12.2912 10.518 11.3095 9.72699L10 8.6732ZM1.75 4.04248C1.75 3.62803 2.08555 3.29248 2.5 3.29248H7.75C8.16445 3.29248 8.5 3.62803 8.5 4.04248V5.64432C8.5 5.64462 8.5 5.64402 8.5 5.64432V7.1062C8.5 7.1064 8.5 7.106 8.5 7.1062V8.70915C8.5 9.1236 8.16445 9.45915 7.75 9.45915H2.5C2.08555 9.45915 1.75 9.1236 1.75 8.70915V4.04248ZM10 6.74781L12.25 8.5585V4.19277L10 6.00346V6.74781Z" fill="white" />
                                                        <path className="inactive" fillRule="evenodd" clipRule="evenodd" d="M1.58294 0.528126C1.32232 0.206181 0.850056 0.156469 0.528111 0.417091C0.206166 0.677714 0.156454 1.14998 0.417076 1.47192L1.08291 2.29442C0.574711 2.70691 0.250007 3.33662 0.250007 4.04234V8.70901C0.250007 9.95188 1.25713 10.959 2.50001 10.959H7.75001C7.86138 10.959 7.97087 10.9509 8.0779 10.9353L8.91708 11.9719C9.1777 12.2939 9.64996 12.3436 9.97191 12.083C10.2939 11.8223 10.3436 11.3501 10.0829 11.0281L9.42336 10.2133C9.78187 9.8148 10 9.28743 10 8.70901V8.67306L11.3095 9.72685C12.2913 10.5179 13.75 9.81834 13.75 8.55883V4.19216C13.75 2.93279 12.2916 2.23329 11.3098 3.02387L10 4.07794V4.04234C10 2.79946 8.99289 1.79234 7.75001 1.79234H2.60635L1.58294 0.528126ZM2.02674 3.46033C1.85783 3.59781 1.75001 3.8074 1.75001 4.04234V8.70901C1.75001 9.12346 2.08555 9.459 2.50001 9.459H6.88281L2.02674 3.46033ZM8.4414 9.00034L3.82064 3.29234H7.75001C8.16446 3.29234 8.50001 3.62789 8.50001 4.04234V8.70901C8.50001 8.81235 8.47914 8.91078 8.4414 9.00034ZM12.25 4.19263L10 6.0033V6.74769L12.25 8.55836V4.19263Z" fill="white" />
                                                    </svg>
                                                </span>
                                            </button>
                                            <button className="call-button button-share-element" onClick={() => sayHello()}>
                                                <span className="icon icon-share">
                                                    <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect x="1" y="1" width="12" height="8" rx="2" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                                                        <path d="M3 12H11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                                    </svg>
                                                </span>
                                            </button>
                                            {/* <button className='call-button bg-light rounded-pill'>
                                                <img src={hangUp} alt='hangup' />
                                            </button> */}
                                        </div>
                                    </div>
                                    <div className="cam-container">
                                        <div className="video">
                                            {/* {
                                showMyVideo ? */}
                                            <video ref={myVideo} autoPlay playsInline muted ></video>
                                            {/* :
                                    <div className='videoOff'>
                                        <h4>GA</h4>
                                    </div>
                            } */}
                                        </div>
                                        <div className="content">
                                            <span className="name">You</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='modal-footer'>
                        </div>
                    </div>
                </div>
            </div>

            <button id='incomingAudio' onClick={playIncomingAudio}></button>

        </div >
    )
}

export default Home