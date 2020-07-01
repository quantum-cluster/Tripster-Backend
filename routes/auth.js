const express = require("express");
const router = express.Router;
const {check} = require("express-validator");
const {register, login, logout} = require("../controllers/auth")

router.post("/register",[
    check("fName")
        .isLength({min: 2})
        .withMessage("Name should be at least 2 characters long."),
    check("email")
        .isEmail()
        .withMessage("Email is a required field. We need it to mail you the invoice. Plus it'll be your username"),
    check("password")
        .isLength({min: 6})
        .withMessage("Password should be at-least 6 characters long.")
], register)

router.post("/login", [
    check("email")
        .isEmail()
        .withMessage("Please enter your email."),
    check("password")
        .isLength({min: 6})
        .withMessage("Password should be at-least 6 characters long.")
], login)

router.get("/logout", logout)

module.exports = router;
