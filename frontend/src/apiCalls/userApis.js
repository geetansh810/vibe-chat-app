const { api } = require("../config/Api")

export async function getUserProfile(userId, token) {
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

export async function getAllUsers(userId, token, keyword) {
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

export async function findUser(token, keyword) {
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