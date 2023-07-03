import React, { useEffect } from 'react'
import logo from "../images/vibeLogo.svg"
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../features/userSlice';
import notificationSound from '../sounds/notificationSound.mp3'

const MenuBar = ({ selectChat }) => {

    // const [userDetails, setUserDetails] = useState();
    const { userDetails, notification } = useSelector((state) => state.user)
    const dispatch = useDispatch();
    // const { user } = isAuthenticated();

    // console.log(userDetails);

    useEffect(() => {
        if (notification.length > 0)
            (new Audio(notificationSound)).play();
    }, [notification])

    const darkMode = () => {
        document.body.classList.toggle('dark-mode');

        if (localStorage.getItem("theme") === "dark") {
            localStorage.setItem("theme", "light")
        } else {
            localStorage.setItem("theme", "dark")
        }
    }

    const changeTheme = (e) => {
        const colors = document.querySelectorAll('.color');
        colors.forEach(color => {
            color.addEventListener('click', e => {
                colors.forEach(c => c.classList.remove('selected'));
            });
        });

        const theme = e.target.getAttribute('data-color')
        document.body.setAttribute('data-theme', theme);
        e.target.classList.add("selected")
    }

    const logout = () => {
        localStorage.removeItem("session");
        window.location.href = "/";
    }

    const openNotification = (notify) => {
        console.log(notify);
        const filterNotifications = notification.filter((noti) => {
            return noti._id !== notify._id
        })
        dispatch(setNotification(filterNotifications))
        selectChat(notify.chat)
    }

    return (
        <div className="header">
            <div className="logo">
                <img src={logo} alt="" />
            </div>
            <div className="user-settings">
                <div className="dropdown">
                    <button className="btn btn-primary rounded-pill notification-box"
                        data-bs-toggle="dropdown" data-bs-target="notify"
                        type="button">
                        <div className="icon">
                            {
                                notification.length > 0 ?
                                    <span className="bell fa fa-bell"></span>
                                    :
                                    <span className="non-bell fa fa-bell"></span>
                            }
                            <span className='bg-danger bell-number'>
                                {notification.length}
                            </span>

                        </div>
                    </button>

                    <ul className="notifications dropdown-menu" role="menu" aria-labelledby="dLabel" id='notify'>

                        <div className="notification-heading"><h4 className="menu-title">Notifications</h4><h4 className="menu-title pull-right">Clear all<i className="glyphicon glyphicon-circle-arrow-right"></i></h4>
                        </div>
                        <div className="notifications-wrapper">
                            <div className="content">

                                {
                                    notification.map((notify) => {
                                        return <div className="notification-item" onClick={() => openNotification(notify)}>
                                            <h4 className="item-title">{notify.sender.firstName + " " + notify.sender.lastName}</h4>
                                            <p className="item-info">{notify.content}</p>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </ul>

                </div>

                <div className="dark-light" onClick={darkMode}>
                    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
                </div>
                <div className="dropdown ms-0">
                    <button className="btn dropdown-toggle d-flex align-items-center"
                        style={{ borderWidth: 0 }}
                        type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <div className="settings">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
                        </div>
                    </button>
                    <ul className="dropdown-menu">
                        <li>
                            <div className="dropdown-item detail-changes mt-0" data-bs-toggle="modal" data-bs-target="#profileImageModal">
                                <div className="detail-change text-primary">
                                    Profile
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="dropdown-item detail-changes mt-0">
                                <div className="detail-change">
                                    Change Color
                                    <div className="colors ms-4 my-auto">
                                        <div className="color blue selected" data-color="blue" onClick={(e) => changeTheme(e)}></div>
                                        <div className="color purple" data-color="purple" onClick={(e) => changeTheme(e)}></div>
                                        <div className="color green" data-color="green" onClick={(e) => changeTheme(e)}></div>
                                        <div className="color orange" data-color="orange" onClick={(e) => changeTheme(e)}></div>
                                    </div>
                                </div>
                            </div>

                        </li>
                        <li>
                            <div className="dropdown-item detail-changes mt-0">
                                <div className="detail-change">
                                    Settings
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="dropdown-item detail-changes mt-0" onClick={logout}>
                                <div className="detail-change text-danger">
                                    Logout
                                    <i className="fa-solid fa-right-from-bracket ms-2 mt-1"></i>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <button type="button" className="btn ms-0 ps-0" data-bs-toggle="modal" data-bs-target="#profileImageModal">
                    <img className="user-profile account-profile" src={userDetails.photo} alt="" />
                </button>
            </div>
        </div>
    )
}

export default MenuBar