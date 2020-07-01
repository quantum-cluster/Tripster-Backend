const User = require("../models/user");
const {validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

////////////////////////////////////////////////////////////////////////////
//////////// REGISTER
exports.register = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
            param: errors.array()[0].param
        })
    }
    const user = new User(req.body)
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        if (!user) {
            return res.json({
                error: "Couldn't register. Failure from Backend."
            })
        }
        const {fName, lName, email, _id} = user;
        res.json({
            name: `${fName} ${lName}`,
            email: email,
            id: _id
        })
    }).then(() => {
        console.log("Successfully registered User.")
    })
}

////////////////////////////////////////////////////////////////////////////
//////////// LOGIN
exports.login = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            error: errors.array()[0].msg,
            param: errors.array()[0].param
        })
    }
    const {email, password} = req.body;

    User.findOne({email: email}, (err, foundUser) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        if (!foundUser) {
            return res.status(404).json({
                error: "User doesn't exist!"
            })
        }
        const {authenticate, _id, fName, lName, email, role} = foundUser;
        if (foundUser) {
            if (!authenticate(password)) {
                return res.status(401).json({
                    error: "Email and Password don't match!"
                })
            }
            // Create authentication token to be saved into the cookies.
            let token = jwt.sign({_id: _id}, process.env.SECRET)

            // Put token into the cookie.
            res.cookie("token", token, {expire: new Date() + 9999})

            // Send response to frontend.
            return res.json({
                token: token,
                user: {
                    _id,
                    fName,
                    lName,
                    email,
                    role
                }
            })
        }
    })
}

////////////////////////////////////////////////////////////////////////////
//////////// LOGOUT
exports.logout = (req, res) => {
    res.clearCookie("token")
    res.json({
        message: "User logged out 👍"
    })
}

////////////////////////////////////////////////////////////////////////////
//////////// CUSTOM MIDDLEWARE
exports.isLoggedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
})

exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id.toString() === req.auth._id.toString()
    if (!checker) {
        return res.status(403).json({
            error: "ACCESS DENIED!"
        })
    }
    next()
}

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "☹ Sorry! you aren't an admin!"
        })
    }
    next()
}
