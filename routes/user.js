const express = require("express");
const router = express.Router();
const {isLoggedIn, isAuthenticated} = require("../controllers/auth")
const {getUserById, getUser, updateUser, userPurchaseList} = require("../controllers/user")

// Params
router.param("userId", getUserById)

// Fetch User
router.get("/user/:userId", isLoggedIn, isAuthenticated, getUser)

// Update User
router.put("/user/:userId", isLoggedIn, isAuthenticated, updateUser)

// User's Flight Purchase List
router.get("/orders/user/:userId", isLoggedIn, isAuthenticated, userPurchaseList)

module.exports = router;
