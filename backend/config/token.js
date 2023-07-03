const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

exports.createToken = (id) => {
    return jwt.sign(
        {
            _id: id,
        },
        secret,
        { expiresIn: "30d" }
    )
}