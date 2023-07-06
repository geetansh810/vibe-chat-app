const express = require("express");
const app = express();
const path = require('path')
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")


const connectDB = require("./config/db");
connectDB()


const cors = require("cors");
app.use(cors())
const bodyParser = require("body-parser");
app.use(bodyParser.json())
const cookieParser = require("cookie-parser");
app.use(cookieParser())


app.use("/api", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes);

const { notFound, errorHandler } = require("./middlewares/errorMiddlewares");
const { log } = require("console");

// --------------------------Deployement----------------------------

const __dirname1 = path.resolve()
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/frontend/build")))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
    })
} else {
    app.get("/", (req, res) => {
        // console.log(req.body)
        res.send("Welcome to our vibe-chat-app backend server - Regards, Geetansh Agrawal")
    })
}

// --------------------------Deployement----------------------------


app.use(notFound)
app.use(errorHandler)


const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log(`-------------------------------------------------------------------`)
    console.log("|                                                                 |")
    console.log(`--------------------Server started at port:${port}--------------------`)
})

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:8500"
    }
})

io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        // console.log(userData);
        console.log(userData._id);
        socket.emit("connected")
    })

    socket.on("join chat", (room) => {
        socket.join(room)
        console.log("User joined room : " + room);
    })

    socket.on("typing", (room) => {
        socket.in(room).emit("typing")
    })

    socket.on("stop typing", (room) => {
        socket.in(room).emit("stop typing")
    })

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id === newMessageRecieved.sender._id) {
                return;
            }
            // console.log("message recieved");
            // console.log(newMessageRecieved.content);
            // console.log(user);
            socket.to(user._id).emit("message recieved", newMessageRecieved)
        })
    })


    socket.on("callUser", (data) => {
        console.log("user called");
        console.log("user to call : ", data.userToCall);
        console.log("from : ", data.from);
        console.log("from name : ", data.name);
        io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name, photo: data.photo })
    })

    socket.on("answerCall", (data) => {
        console.log("Answer call");
        io.to(data.to).emit("callAccepted", data.signal)
    })

    socket.on("callEnded", (data) => {
        io.to(data.to).emit("endCall")
    })

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id)
    })

})