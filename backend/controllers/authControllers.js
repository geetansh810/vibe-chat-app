const { validationResult } = require("express-validator");
const { createToken } = require("../config/token");
const User = require("../models/user")
const formidable = require('formidable');
const asyncHandler = require("express-async-handler")

function validationCheck(req, res) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).json(
            {
                message: "Validation error",
                errors: errors.errors
            })
    }
}

exports.signup = asyncHandler(async (req, res) => {

    // console.log(req.body);

    const {
        firstName,
        lastName,
        email,
        mobileNumber,
        encry_password,
        photo
    } = req.body

    // const photo = {
    //     data: req.file.filename,
    //     contentType: req.file.mimetype
    // }

    if (
        !firstName ||
        !lastName ||
        !email ||
        !encry_password ||
        !mobileNumber ||
        !photo
    ) {
        return res.status(400).json({
            error: "Please provide all required the fields",
        });
    }

    const user = new User({
        firstName,
        lastName,
        email,
        encry_password,
        mobileNumber,
        photo
    });

    // console.log(user);

    User.findOne({ email, mobileNumber }, (err, existingUser) => {
        if (err) {
            return res.status(500).json({
                message: "Server error"
            })
        }

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        //save the user
        user.save(async (err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    message: "Failed to create user",
                    error: Object.keys(err.keyPattern) || err
                })
            }

            const token = await createToken(user._id)

            res.cookie("token", token, {
                expire: new Date(new Date()).getDate() + 9999,
            })

            const { _id, firstName, lastName, email, photo } = user;

            return res.status(200).json(
                {
                    token,
                    user: {
                        _id,
                        name: `${firstName} ${lastName}`,
                        email,
                        mobileNumber,
                        photo
                    }
                })
        })
    })

})

exports.signin = asyncHandler(async (req, res) => {

    //error validation
    // validationCheck(req, res);

    const { email, mobileNumber, encry_password } = req.body;

    if (email.length <= 0 && mobileNumber.length <= 0) {
        return res.status(400).json({
            message: "Please enter the details",
        })
    }

    const loginKey = email.length > 0 ? { email } : { mobileNumber }

    User.findOne(
        loginKey
        , async (err, user) => {

            if (err || user === null) {
                // console.log(err);
                return res.status(400).json({
                    message: "User not found",
                    error: err
                })
            }

            //validate for correct password
            const checkPassword = await user.validPassword(encry_password);

            if (!checkPassword) {
                return res.status(400).json({
                    error: {
                        message: "Invalid credentials",
                        field: "Password"
                    }
                })
            }

            const token = await createToken(user._id)

            res.cookie("token", token, {
                expire: new Date(new Date()).getDate() + 9999,
            })

            const { _id, firstName, lastName, email, photo, mobileNumber } = user;

            return res.status(200).json(
                {
                    token,
                    user: {
                        _id,
                        name: `${firstName} ${lastName}`,
                        email,
                        photo,
                        mobileNumber
                    }
                })
        })

})


exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "User signed-out succesfully",
    });
};

exports.testRoute = (req, res) => {
    res.send("Hello from backend")
}


// exports.isSignedIn = expressJwt({
//     secret: "shhhh",
//     userProperty: "auth",
// });

// //authentication of user
// exports.isAuthenticated = (req, res, next) => {
//     const checker = req.profile && req.auth && req.profile._id == req.auth._id;
//     if (!checker) {
//         return res.status(403).json({
//             error: "ACCESS DENIED",
//         });
//     }
//     next();
// };
