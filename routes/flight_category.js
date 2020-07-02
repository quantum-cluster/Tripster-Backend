const express = require("express");
const router = express.Router();

const {
    getFlightCategoryById,
    createFlightCategory,
    getFlightCategory,
    getAllFlightCategories,
    updateFlightCategory,
    removeFlightCategory
} = require("../controllers/flight_category")
const {getUserById} = require("../controllers/user")
const {isLoggedIn, isAuthenticated, isAdmin} = require("../controllers/auth")

// Params
router.param("flightCategoryId", getFlightCategoryById)
router.param("userId", getUserById)

// Actual Routes
// Create
router.post("/flight-category/create/:userId", isLoggedIn, isAuthenticated, isAdmin, createFlightCategory)

// Read
router.get("/flight-category/:flightCategoryId", getFlightCategory)
router.get("/flight-categories", getAllFlightCategories)

// Update
router.put("/flight-category/:flightCategoryId/:userId", isLoggedIn, isAuthenticated, isAdmin, updateFlightCategory)

// Delete
router.delete("/flight-category/:flightCategoryId/:userId", isLoggedIn, isAuthenticated, isAdmin, removeFlightCategory)

module.exports = router