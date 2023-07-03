const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        const database = process.env.DATABASE
        // console.log(database);
        mongoose.set("strictQuery", false);
        const conn = await mongoose.connect(database)

        console.log(`----------MongoDB Connected Successfully: ${conn.connection.host}:${conn.connection.port}----------`)
        console.log("|                                                                 |")
        console.log(`-------------------------------------------------------------------`)

    }
    catch (error) {
        console.log(`Error in DB: ${error.message}`)
    }
}

module.exports = connectDB