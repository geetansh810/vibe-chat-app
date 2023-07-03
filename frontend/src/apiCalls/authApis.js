const { api } = require("../config/Api")

exports.signup = async (signupDetails) => {
    console.log(signupDetails)
    return await fetch(
        `${api}/signup`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(signupDetails),
        }

    ).then((data) => {
        return data.json()
    })

}

exports.signin = async (signinDetails) => {
    return await fetch(
        `${api}/signin`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(signinDetails),
        }
    ).then((data) => {
        return data.json()
    })

}

exports.authenticate = (data, next) => {
    if (typeof window != "undefined") {
        localStorage.setItem("session", JSON.stringify(data));
        next();
    }
};
exports.signout = (next) => {

    if (typeof window != "undefined") {
        localStorage.removeItem("session");
        next();
    }
};

exports.isAuthenticated = () => {
    if (typeof window != "undefined") {
        return JSON.parse(localStorage.getItem("session"));
    }
    return false;
};
