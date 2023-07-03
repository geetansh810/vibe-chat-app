import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../apiCalls/authApis";

const AuthRoutes = ({ children }) => {
    let auth = isAuthenticated();
    let location = useLocation();

    if (!auth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default AuthRoutes;
