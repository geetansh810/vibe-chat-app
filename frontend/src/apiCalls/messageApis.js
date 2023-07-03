const { api } = require("../config/Api")

export async function sendMessage(token, chatId, content) {
    return await fetch(
        `${api}/message`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ chatId, content }),
        }
    ).then((data) => {
        console.log(data);
        return data.json()
    })
}

export async function getAllMessages(token, chatId) {
    return await fetch(
        `${api}/message/${chatId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${token}`
            },
        }
    ).then((data) => {
        console.log(data);
        return data.json()
    })
}
