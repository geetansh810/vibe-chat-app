import React, { useEffect } from 'react'
import groupImage from '../images/group.png'
import { useSelector } from 'react-redux'

const ConversationDetails = ({ removeParticipant, goToPage }) => {

    const { selectedChat, userDetails } = useSelector((state) => state.user)

    useEffect(() => {
        console.log("Chat updated");
    }, [selectedChat])

    const convertDate = (givenDate) => {
        var date = new Date(givenDate)
        // const lastTime = date.toLocaleTimeString().split(":")[0] + ":" + date.toLocaleTimeString().split(":")[1] + " " + date.toLocaleTimeString().split(":")[2].split(" ")[1];
        return date.toLocaleDateString()
    }

    return (
        <div className="detail-area" id='detailArea'>
            {
                (window.innerWidth <= 780) &&
                <div className='btn rounded-pill back-btn' onClick={() => goToPage("conversation")}>
                    <i className="fa-solid fa-arrow-left"></i>
                </div>

            }

            <div className="detail-area-header">
                <div className="msg-profile group" data-bs-toggle="modal" data-bs-target="#chatProfileModal">
                    {
                        < img className="chat-area-profile" src={
                            selectedChat.isGroupChat ? groupImage :
                                selectedChat.users[0]._id === userDetails._id ?
                                    selectedChat.users[1].photo
                                    :
                                    selectedChat.users[0].photo
                        } alt="groupImage" />
                    }
                </div>
                <div className="detail-title">
                    {
                        selectedChat.isGroupChat ?
                            <button className='btn btn-light fw-bold' data-bs-placement="bottom" title="Edit Name"
                                data-bs-toggle="modal" data-bs-target="#groupNameChangeModal"
                            >
                                {selectedChat.chatName}
                                <i className="fa-solid fa-pen-to-square ms-3"></i>
                            </button>
                            :
                            selectedChat.users[0]._id === userDetails._id ?
                                selectedChat.users[1].firstName + " " + selectedChat.users[1].lastName
                                :
                                selectedChat.users[0].firstName + " " + selectedChat.users[0].lastName
                    }
                </div>
                <div className="detail-subtitle">Created by
                    {
                        selectedChat.isGroupChat ?
                            " " + selectedChat.groupAdmin.firstName
                            :
                            " you"
                    } , {convertDate(selectedChat.createdAt)}
                </div>

                <div className="detail-buttons">
                    <button className="detail-button">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" className="feather feather-phone">
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                        </svg>
                        Voice Call
                    </button>
                    <button className="detail-button">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" className="feather feather-video">
                            <path d="M23 7l-7 5 7 5V7z" />
                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
                        Video Call
                    </button>
                </div>
            </div>

            {
                selectedChat.isGroupChat && (
                    <>
                        <div className="detail-photo-title mt-5 mb-0">
                            <i className="fa-solid fa-user-group me-3"></i>
                            Group Members
                        </div>
                        <hr></hr>
                        <div className="msg grpMember" data-bs-toggle="modal" data-bs-target="#addMemberModal">
                            <div className='msg-profile text-center text-light d-flex justify-content-center align-items-center bg-primary'>
                                <i className="fa-solid fa-user-plus"></i>
                            </div>
                            <div className="msg-detail">
                                <div className="msg-username" >
                                    Add Participants
                                </div>
                            </div>
                        </div>

                        {
                            selectedChat.users.map((mem, i) => {
                                return (
                                    <div className="msg grpMember" key={i}>
                                        <img className="msg-profile" src={mem.photo} alt="profileImage" />
                                        <div className="msg-detail">
                                            <div className="msg-username">{
                                                mem.firstName + " " + mem.lastName
                                            }
                                                {
                                                    selectedChat.groupAdmin._id === mem._id &&
                                                    <span className="badge admin-badge ms-2">Admin</span>

                                                }
                                            </div>
                                            <div className="msg-detail d-flex">
                                                <div className='d-flex flex-column'>
                                                    <div className="">{mem.email}</div>
                                                    <div className="msg-message">{mem.mobileNumber}

                                                        {
                                                            selectedChat.groupAdmin._id !== mem._id &&
                                                            <button className='btn btn-sm btn-outline-danger ms-2'
                                                                onClick={() => { removeParticipant(mem._id) }}
                                                            >
                                                                Remove
                                                                <i className="fas fa-trash ms-2"></i>
                                                            </button>
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </>

                )
            }

            {
                !selectedChat.isGroupChat && (
                    <>
                        <div className="detail-photo-title mt-5 mb-0">
                            <i className="fa-solid fa-user me-3"></i>
                            Details
                        </div>
                        <hr></hr>
                        <div className="text-secondary">Email - {
                            userDetails._id === selectedChat.users[1]._id ?
                                selectedChat.users[0].email
                                :
                                selectedChat.users[1].email

                        }</div>
                        <div className="text-secondary">Mobile - {
                            userDetails._id === selectedChat.users[1]._id ?
                                selectedChat.users[0].mobileNumber
                                : selectedChat.users[0].mobileNumber
                        }</div>
                    </>

                )
            }

            <div className="detail-changes">
                <input type="text" placeholder="Search in Conversation" />
            </div>
            <div className="detail-photos">
                <div className="detail-photo-title">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-image">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" /></svg>
                    Shared photos
                </div>
                <div className="detail-photo-grid">
                    <img src="https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2168&q=80" alt='icon' />
                    <img src="https://images.unsplash.com/photo-1516085216930-c93a002a8b01?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80" alt='icon' />
                    <img src="https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2309&q=80" alt='icon' />
                </div>
                <div className="view-more">View More</div>
            </div>
        </div >
    )
}

export default ConversationDetails