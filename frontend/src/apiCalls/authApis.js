const { api } = require("../config/Api")

export function isAuthenticated() {
    if (typeof window != "undefined") {
        return JSON.parse(localStorage.getItem("session"));
    }
    return false;
};

export async function signup(signupDetails) {
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

export async function signin(signinDetails) {
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

export function authenticate(data, next) {
    if (typeof window != "undefined") {
        localStorage.setItem("session", JSON.stringify(data));
        next();
    }
};
export function signout(next) {

    if (typeof window != "undefined") {
        localStorage.removeItem("session");
        next();
    }
};