// import React, { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { isAuthenticated } from "../apiCalls/authApis";
// import { getAllChats } from "../apiCalls/chatApis";

// const ChatContext = createContext();

// const ChatProvider = ({ children }) => {
//     const [userDetails, setUserDetails] = useState();
//     const [selectedChat, setSelectedChat] = useState();
//     const [notification, setNotification] = useState([]);
//     const [chats, setChats] = useState();

//     const nav = useNavigate();

//     useEffect(() => {
//         if (isAuthenticated()) {
//             const { user, token } = JSON.parse(localStorage.getItem("session"));
//             setUserDetails(user);
//             console.log(user);

//             getAllChats(token).then((data) => {
//                 setChats(data);
//                 // console.log(data);
//             })
//         } else {
//             nav("/login");
//         }
//     }, [nav]);

//     return (
//         <ChatContext.Provider
//             value={{
//                 selectedChat,
//                 setSelectedChat,
//                 userDetails,
//                 setUserDetails,
//                 notification,
//                 setNotification,
//                 chats,
//                 setChats,
//             }}
//         >
//             {children}
//         </ChatContext.Provider>
//     );
// };

// export const ChatState = () => {
//     return useContext(ChatContext);
// };

// export default ChatProvider;