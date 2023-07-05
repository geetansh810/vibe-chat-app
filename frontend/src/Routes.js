import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes as Switch } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingOverlay from 'react-loading-overlay-ts';
import HashLoader from 'react-spinners/HashLoader'
import AuthRoutes from './routes/AuthRoutes'
import LoginRoutes from './routes/LoginRoutes'
import Home from './pages/Home'
import Login from './pages/Login'

import { Provider } from 'react-redux'
import store from './store'
import VideoCall from './components/VideoCall';
import IncomingCall from './components/IncomingCall';

const Routes = () => {
    const [isActive, setActive] = useState(false);
    function loader(state) {
        setActive(state);
    }

    return (
        <Router>
            <ToastContainer
                theme="dark"
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <LoadingOverlay
                active={isActive}
                spinner={<HashLoader color="#f8dd30" />}
                text=''
            >

                <Switch>
                    <Route path='/' exact element={
                        <AuthRoutes>
                            <Provider store={store}>
                                <Home loader={loader} />
                            </Provider>
                        </AuthRoutes>
                    } />
                    <Route path='/login' element={
                        <LoginRoutes>
                            <Login loader={loader} />
                        </LoginRoutes>
                    } />
                    <Route path='/call/ongoing' element={<VideoCall />} />
                    <Route path='/call/incoming' element={<IncomingCall />} />
                </Switch>
            </LoadingOverlay>
        </Router>
    )
}

export default Routes