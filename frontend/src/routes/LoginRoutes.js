import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../apiCalls/authApis";
import { toast } from 'react-toastify';

const LoginRoutes = ({ children }) => {
    let auth = isAuthenticated();
    let location = useLocation();

    if (!auth) {
        return children;
    }

    toast("Welcome Back !!!")
    return <Navigate exact to="/" state={{ from: location }} replace />;
};

export default LoginRoutes;
