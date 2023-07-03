const { api } = require("../config/Api")

exports.accessNewChat = async (token, userId) => {
    return await fetch(
        `${api}/chat`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ userId: userId }),
        }
    ).then((data) => {
        // console.log(data);
        return data.json()
    })
}

exports.getAllChats = async (token) => {
    return await fetch(
        `${api}/chat`,
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

exports.createGroupChat = async (token, users, chatName) => {
    return await fetch(
        `${api}/chat/group`,
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ users, chatName }),
        }
    ).then((data) => {
        // console.log(data);
        return data.json()
    })
}

exports.renameGroupChat = async (token, chatName, chatId) => {
    return await fetch(
        `${api}/chat/group/rename`,
        {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ chatId, chatName }),
        }
    ).then((data) => {
        // console.log(data);
        return data.json()
    })
}

exports.addUsersToGroupChat = async (token, chatId, userId) => {
    return await fetch(
        `${api}/chat/group/add`,
        {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ chatId, userId }),
        }
    ).then((data) => {
        // console.log(data);
        return data.json()
    })
}

exports.removeUserFromGroupChat = async (token, chatId, userId) => {
    return await fetch(
        `${api}/chat/group/remove`,
        {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ chatId, userId }),
        }
    ).then((data) => {
        // console.log(data);
        return data.json()
    })
}


