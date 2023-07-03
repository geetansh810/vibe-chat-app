import React, { useState } from 'react'
import { authenticate, signin, signup } from '../apiCalls/authApis'
import chatGif from "../images/chat-gif.gif"
import messagingGif from "../images/chatting.gif"
import userImage from "../images/user.png"
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom"

const Login = ({ loader }) => {
    const nav = useNavigate()

    const [showLogin, setShowLogin] = useState(false)

    const defaultLogin = {
        email: '',
        encry_password: ''
    }

    const defaultSignup = {
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: 0,
        encry_password: '',
        photo: ''
    }

    const [loginDetails, setLoginDetails] = useState(defaultLogin)
    const [signupDetails, setSignupDetails] = useState(defaultSignup)

    function handleLoginChanges(e) {
        setLoginDetails({
            ...loginDetails,
            [e.target.name]: e.target.value
        })
        // console.log(loginDetails)
    }

    function handleSignupChanges(e) {
        setSignupDetails({
            ...signupDetails,
            [e.target.name]: e.target.name === "photo" ? e.target.files[0] : e.target.value
        })
        // console.log(signupDetails)
    }

    function onLogin(e) {
        loader(true);
        e.preventDefault()
        signin(loginDetails).then(data => {
            console.log(data);
            // console.log(data.hasOwnProperty("error"));
            loader(false);
            if (data.hasOwnProperty("error")) {
                toast(data.error.message);
                return;
            }
            toast(`Welcome ${data.user.name}`)
            authenticate(data, () => {
                nav("/")
            })
        })
    }

    // const performRedirect = () => {
    //     if (didRedirect) {
    //         if (isAuthenticated().user && isAuthenticated().user.role === 1) {
    //             return <Navigate to="/admin/dashboard" />;
    //         } else {
    //             return <Navigate to="/" />;
    //         }
    //     }
    //     if (isAuthenticated()) {
    //         return <Navigate to="/" />;
    //     }
    // };


    async function onSignup(e) {
        e.preventDefault()
        loader(true);
        const formData = new FormData()
        formData.append('firstName', signupDetails.firstName)
        formData.append('lastName', signupDetails.lastName)
        formData.append('email', signupDetails.email)
        formData.append('mobileNumber', signupDetails.mobileNumber)
        formData.append('encry_password', signupDetails.encry_password)

        if (signupDetails.photo) {
            let maxImageSize = 1024 * 1024;

            if (signupDetails.photo.type !== "image/jpeg" || signupDetails.photo.size > maxImageSize) {
                toast("Only jpeg images of Max Size 1MB are allowed, Please reupload");
                loader(false);
                return;
            }

            const imageData = new FormData();
            imageData.append("file", signupDetails.photo);
            imageData.append("upload_preset", "chat_app");
            imageData.append("cloud_name", "cohackin");
            await fetch("https://api.cloudinary.com/v1_1/cohackin/image/upload", {
                method: "post",
                body: imageData,
            })
                .then((res) => res.json())
                .then((data) => {
                    formData.append('photo', data.url.toString())
                    console.log(data.url.toString());
                    return data.url.toString();
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            toast("Please Select an Image!");
            loader(false);
            return;
        }

        const details = {};

        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
            details[pair[0]] = pair[1];
        }

        await signup(details).then((data) => {
            loader(false);
            if (data.user === undefined) {
                console.log(data);
                toast(data.error)
                return;
            }

            toast(data.message)
            toast("Please login")
            // console.log(data);

            // if (data.hasOwnProperty("error")) {
            //     toast(data.error.message);
            //     return;
            // }
            // toast("Welcome")
            // authenticate(data, () => {
            //     nav("/")
            // })

            setShowLogin(true)
            setLoginDetails({ ...loginDetails, email: data.user.email })
        }
        )
    }

    return (
        <section className="login-conatiner">
            <div className={showLogin ? "container" : "container active"}>
                <div className="user signinBx">
                    <div className="imgBx"><img src={messagingGif} alt="" /></div>
                    <div className="formBx">
                        <form action="" onSubmit={(e) => onLogin(e)}>
                            <h2>Sign In</h2>
                            <input type="text" name="email" placeholder="Email" value={loginDetails.email} onChange={(e) => handleLoginChanges(e)} />
                            <p>or</p>
                            <input type="number" name="mobileNumber" placeholder="Mobile Number" value={loginDetails.mobileNumber} onChange={(e) => handleLoginChanges(e)} />
                            <br></br>
                            <input type="password" name="encry_password" placeholder="Password" value={loginDetails.encry_password} onChange={(e) => handleLoginChanges(e)} />
                            <input type="submit" name="" value="Login" />
                            <p className="signup">
                                Don't have an account ?
                                <span className="text-primary fw-bold p-2" style={{ cursor: 'pointer' }} onClick={() => setShowLogin(!showLogin)}>Sign Up.</ span>
                            </p>
                        </form>
                    </div>
                </div>
                <div className="user signupBx">
                    <div className="formBx">
                        <form action="" onSubmit={(e) => onSignup(e)}>
                            <h2>Create an account</h2>
                            <div className="d-flex gap-2">
                                <input type="text" name="firstName" placeholder="First Name" onChange={(e) => handleSignupChanges(e)} />
                                <input type="text" name="lastName" placeholder="Last Name" onChange={(e) => handleSignupChanges(e)} />
                            </div>
                            <input type="email" name="email" placeholder="Email Address" onChange={(e) => handleSignupChanges(e)} />
                            <input type="number" name="mobileNumber" placeholder="Mobile Number" onChange={(e) => handleSignupChanges(e)} />
                            <input type="password" name="encry_password" placeholder="Password" onChange={(e) => handleSignupChanges(e)} />
                            <div className="d-flex justify-center align-items-center">
                                <div className="profileLabel">
                                    Profile Photo
                                    <span>
                                        <img src={userImage} className="w-25 ms-3" alt='profileImage' />
                                    </span>
                                </div>
                                <input type="file" accept='image/jpeg' className="profileInput" name="photo" id="" onChange={(e) => handleSignupChanges(e)} />
                            </div>
                            <input type="submit" name="" value="Sign Up" />
                            <p className="signup">
                                Already have an account ?
                                <span className="text-primary fw-bold p-2" style={{ cursor: 'pointer' }} onClick={() => setShowLogin(!showLogin)}>Sign in.</ span>
                            </p>
                        </form>
                    </div>
                    <div className="imgBx"><img src={chatGif} alt="" /></div>
                </div>
            </div>
        </section>
    )
}

export default Login