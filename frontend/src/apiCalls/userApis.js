const { api } = require("../config/Api")

exports.getUserProfile = async (userId, token) => {
    return await fetch(
        `${api}/user/profile/${userId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${token}`
            }
        }
    ).then((data) => {
        // console.log(data);
        return data.json()
    })
}

exports.getAllUsers = async (userId, token, keyword) => {
    return await fetch(
        `${api}/user/users?search=${keyword}`,
        {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${token}`
            },
        }
    ).then((data) => {
        // console.log(data);
        return data.json()
    })
}

exports.findUser = async (token, keyword) => {
    return await fetch(
        `${api}/user/user?search=${keyword}`,
        {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${token}`
            },
        }
    ).then((data) => {
        // console.log(data);
        return data.json()
    })
}