import React, { useState } from 'react'
import { findUser } from '../apiCalls/userApis'
import { isAuthenticated } from '../apiCalls/authApis';
import groupChatIcon from '../images/user-avatar.png'
import groupImage from '../images/group.png'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';


const Modals = ({ newChat, changeGrpName, addParticipants, createNewGroupChat }) => {

    const { token } = isAuthenticated()
    const { selectedChat, userDetails } = useSelector((state) => state.user)

    const [searchText, setSearchText] = useState("");
    const [users, setUsers] = useState([]);
    const [grpName, setGrpName] = useState("")
    const [groupMembers, setGroupMembers] = useState([]);
    const [groupName, setGroupName] = useState("");


    const getUser = (key) => {
        setSearchText(key)
        findUser(token, key).then((data) => {
            if (data.length > 0) {
                setUsers(data)
                // console.log(data);
            }
        })
    }

    const setNewChat = (id) => {
        newChat(id)
        setSearchText("");
        setUsers([])
    }

    const addMember = (member) => {
        console.log(member);
        console.log(groupMembers);

        const res = selectedChat.users.some((mem) => {
            return mem._id === member._id
        })

        setUsers([])
        console.log(res);
        if (res) {
            toast("Member already added");
            return
        }
        setSearchText("")
        setGroupMembers([...groupMembers, member])
    }

    const removeMember = (member) => {
        const res = groupMembers.filter((mem) => {
            return mem._id !== member._id
        })
        setGroupMembers(res)
    }

    const changeName = () => {
        changeGrpName(grpName)
        setGrpName("")
    }

    return (
        <>
            {
                Object.keys(selectedChat).length !== 0 &&
                <>
                    <div className="modal fade" id="chatProfileModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content bg-dark">
                                <button type="button" className="bg-light btn-close ms-auto p-3 rounded" data-bs-dismiss="modal" aria-label="Close"></button>
                                <div class="profile-container">
                                    <div class="cards">
                                        <div class="imgBox">
                                            <img
                                                src={selectedChat.isGroupChat ? groupImage : selectedChat.users[1].photo}
                                                alt='profileImage'
                                            />
                                        </div>
                                        <div class="content">
                                            <div class="details">
                                                <h2>
                                                    {
                                                        selectedChat.isGroupChat ?
                                                            selectedChat.chatName
                                                            :
                                                            selectedChat.users[1].firstName + " " + selectedChat.users[1].lastName
                                                    }
                                                </h2>
                                                {/* <ul class="social_icons">
                                                <li>
                                                    <a href="#"><i class="fab fa-facebook-f"></i></a>
                                                </li>
                                                <li>
                                                    <a href="#"><i class="fab fa-twitter"></i></a>
                                                </li>
                                                <li>
                                                    <a href="#"><i class="fab fa-linkedin"></i></a>
                                                </li>
                                                <li>
                                                    <a href="#"><i class="fab fa-instagram"></i></a>
                                                </li>
                                            </ul> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="groupNameChangeModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Change Group Name</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body d-flex justify-content-between align-items-center">
                                    <div className='w-100 me-2'>
                                        <input className='input-area' placeholder={selectedChat.chatName} onChange={(e) => { setGrpName(e.target.value) }} />
                                    </div>
                                    <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={() => changeName()}>Change</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="addMemberModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Add Participants</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>

                                {
                                    selectedChat.isGroupChat &&
                                        selectedChat.groupAdmin._id === userDetails._id ?
                                        <>
                                            <div className="modal-body">
                                                <div className="search-bar">
                                                    <input type="text" className='bg-light px-4' placeholder="Enter Email ID or Mobile Number" value={searchText} onChange={(e) => { getUser(e.target.value) }} />
                                                    {
                                                        users.length > 0 && (
                                                            <ul className='searchOptions'>
                                                                {
                                                                    users.map((item, index) =>
                                                                        <li key={index} onClick={() => { addMember(item) }} className='searchOption'>
                                                                            <img src={item.photo} alt="" className='searchOptionImage' />
                                                                            <span>{item.firstName + " " + item.lastName}</span>
                                                                        </li>
                                                                    )
                                                                }
                                                            </ul>
                                                        )
                                                    }
                                                </div>
                                                <div>
                                                    <p className='mt-5'>Selected Members</p>
                                                    <hr></hr>
                                                    {groupMembers && groupMembers.map((member) => {
                                                        return <button key={member._id} className="badge rounded-pill btn member-badge mx-2" onClick={() => { removeMember(member) }}>
                                                            <img className='badge-thumbanil' src={member.photo} alt='member_img' />
                                                            <span>
                                                                {member.firstName + " " + member.lastName}
                                                            </span>
                                                            <i className="fa-solid fa-trash ms-2"></i>
                                                        </button>
                                                    })}
                                                </div>

                                            </div>
                                            <div className='modal-footer'>
                                                <button type="button" className="btn btn-success mx-auto px-5" data-bs-dismiss="modal" onClick={() => addParticipants(groupMembers)}>Add</button>
                                            </div>
                                        </>
                                        :
                                        <div className="modal-body">
                                            <h4 className='text-center text-secondary'>Only admins can add members</h4>
                                        </div>
                                }

                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="newChatModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">New Chat</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="search-bar">
                                        <input type="text" placeholder="Enter Email ID or Mobile Number" value={searchText} onChange={(e) => { getUser(e.target.value) }} />
                                        {
                                            users.length > 0 && (
                                                <ul className='searchOptions'>
                                                    {
                                                        Object.keys(users).map((item, index) =>
                                                            <li key={index} onClick={() => { setNewChat(users[item]._id) }} className='searchOption' data-bs-dismiss="modal" aria-label="Close">
                                                                <img src={users[item].photo} alt="" className='searchOptionImage' />
                                                                <span>{users[item].firstName + " " + users[item].lastName}</span>
                                                            </li>
                                                        )
                                                    }
                                                </ul>
                                            )
                                        }

                                    </div>
                                </div>
                                <div className="modal-footer d-flex">
                                    <button className="btn btn-light newGrpChat" data-bs-toggle="modal" data-bs-target="#newGroupModal" onClick={() => setUsers([])}>
                                        <img src={groupChatIcon} alt='add' className='' />
                                        <span>New Group</span>
                                    </button>
                                    {/* <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="newGroupModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">New Group Chat</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <p className=''>Group Name</p>
                                    <input className='form-control' type='text' placeholder='Enter Group Name' value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                                    <hr></hr>
                                    <p className='mt-5'>Add Group Members</p>
                                    <hr></hr>
                                    <div className="search-bar">
                                        <input type="text" className='bg-light' placeholder="Enter Email ID or Mobile Number" value={searchText} onChange={(e) => { getUser(e.target.value) }} />
                                        {
                                            users.length > 0 && (
                                                <ul className='searchOptions'>
                                                    {
                                                        users.map((item, index) =>
                                                            <li key={index} onClick={() => { addMember(item) }} className='searchOption'>
                                                                <img src={item.photo} alt="" className='searchOptionImage' />
                                                                <span>{item.firstName + " " + item.lastName}</span>
                                                            </li>
                                                        )
                                                    }
                                                </ul>
                                            )
                                        }
                                    </div>
                                    <div>
                                        <p className='mt-5'>Selected Members</p>
                                        <hr></hr>
                                        {groupMembers && groupMembers.map((member) => {
                                            return <button key={member._id} className="badge rounded-pill btn member-badge mx-2" onClick={() => { removeMember(member) }}>
                                                <img className='badge-thumbanil' src={member.photo} alt='member_img' />
                                                <span>
                                                    {member.firstName + " " + member.lastName}
                                                </span>
                                                <i className="fa-solid fa-trash ms-2"></i>
                                            </button>
                                        })}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline-success m-auto" data-bs-dismiss="modal" onClick={createNewGroupChat}>Create Group</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
            <div className="modal fade" id="profileImageModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content bg-dark">
                        <button type="button" className="bg-light btn-close ms-auto p-3 rounded" data-bs-dismiss="modal" aria-label="Close"></button>
                        <div class="profile-container">
                            <div class="cards">
                                <div class="imgBox">
                                    <img
                                        src={userDetails.photo}
                                        alt='profileImage'
                                    />
                                </div>
                                <div class="content">
                                    <div class="details">
                                        <h2>
                                            {userDetails.name}
                                            <br />
                                            <span>{userDetails.mobileNumber}</span>
                                            <br />
                                            <span>{userDetails.email}</span>
                                        </h2>
                                        {/* <ul class="social_icons">
                                                <li>
                                                    <a href="#"><i class="fab fa-facebook-f"></i></a>
                                                </li>
                                                <li>
                                                    <a href="#"><i class="fab fa-twitter"></i></a>
                                                </li>
                                                <li>
                                                    <a href="#"><i class="fab fa-linkedin"></i></a>
                                                </li>
                                                <li>
                                                    <a href="#"><i class="fab fa-instagram"></i></a>
                                                </li>
                                            </ul> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Modals