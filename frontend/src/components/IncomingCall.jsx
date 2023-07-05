import React from 'react'
import '../css/videoCall.css'
import { isAuthenticated } from '../apiCalls/authApis'
import callRing from '../sounds/callRing.mp3'
import hangUp from '../images/hangUp.png'
import hangOn from '../images/hangOn.json'
import Lottie from 'lottie-react'

const IncomingCall = () => {
    const { user } = isAuthenticated();

    const playSound = () => {
        (new Audio(callRing)).play()
    }

    return (
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
                <button className='call-button btn btn-light rounded-pill mx-3 incoming-btn mt-0' onClick={playSound}>
                    <Lottie animationData={hangOn} />
                </button>
            </div>
        </div>
    )
}

export default IncomingCall