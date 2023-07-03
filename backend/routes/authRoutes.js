const express = require("express");
const { check } = require("express-validator");
const { signup, signin, testRoute } = require("../controllers/authControllers");
const router = express.Router();
const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })

router.get("/test",
    testRoute
)

router.post("/signup",
    [
        check("firstName", "Minimum length should be 3").isLength({ min: 3 }),
        check("lastName", "Minimum length should be 1").isLength({ min: 1 }),
        check("encry_password", "Minimum length of password should be 8").isLength({ min: 8 }),
        check("email", "Enter the correct form of email").isEmail(),
    ],
    signup
)

router.post("/signin",
    [
        check("email", "Invalid email").isEmail(),
        check("encry_password", "Minimum length of password should be 8").isLength({ min: 8 }),
    ],
    signin
)

module.exports = router;