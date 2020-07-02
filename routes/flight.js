const express = require("express");
const router = express.Router();

const {
    getFlightById,
    createFlight,
    getFlight,
    removeFlight,
    updateFlight,
    getAllFlights,
    getAllUniqueCategories,
} = require("../controllers/flight");
const {getUserById} = require("../controllers/user");
const {isLoggedIn, isAuthenticated, isAdmin} = require("../controllers/auth");

// Params
router.param("userId", getUserById)
router.param("flightId", getFlightById)

// Actual Routes
// Create
router.post("/flight/create/:userId", isLoggedIn, isAuthenticated, isAdmin, createFlight)

// Read
router.get("/flight/:flightId", getFlight)

// Update
router.put("/flight/:flightId/:userId", isLoggedIn, isAuthenticated, isAdmin, updateFlight)

// Delete
router.delete("/flight/:flightId/:userId", isLoggedIn, isAuthenticated, isAdmin, removeFlight)

// Listing
router.get("/flights", getAllFlights)
router.get("/flights/categories", getAllUniqueCategories)

module.exports = router;
