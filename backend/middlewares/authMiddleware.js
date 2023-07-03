const jwt = require("jsonwebtoken");
const User = require("../models/user");
// const asyncHandler = require("express-async-handler");

const protect = async (req, res, next) => {
    let token;
    // console.log("hello bro");
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

        try {
            token = req.headers.authorization.split(" ")[1];

            //decode token id
            const decoded = jwt.verify(token, "shhhh");
            req.user = await User.findById(decoded._id).select("-encry_password -salt");
            next();
        }

        catch (err) {
            console.log(err);
            return res.status(401).json({ message: "Invalid token" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "No token" });
    }
}

module.exports = { protect }
