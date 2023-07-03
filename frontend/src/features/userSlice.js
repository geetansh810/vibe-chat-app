import { createSlice } from '@reduxjs/toolkit'
// import { getAllChats } from '../apiCalls/chatApis';
// import { getAllMessages } from '../apiCalls/messageApis';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userDetails: {},
        selectedChat: {},
        notification: [],
        chats: [],
        messages: []
    },
    reducers: {
        setUserDetails: (state, action) => {
            state.userDetails = action.payload
        },

        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload
            // getAllMessages(JSON.parse(localStorage.getItem("session")).token, state.selectedChat._id).then((data) => {
            //     state.messages = data
            // })
        },
        setNotification: (state, action) => {
            state.notification = action.payload
        },
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setMessages: (state, action) => {
            state.messages = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { setUserDetails, setSelectedChat, setNotification, setChats, setMessages } = userSlice.actions

export default userSlice.reducer