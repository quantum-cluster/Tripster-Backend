const express = require("express");
const router = express.Router();

const {
    getHotelById,
    createHotel,
    getHotel,
    photo,
    removeHotel,
    updateHotel,
    getAllHotels,
    getAllUniqueCategories,
    updateRooms
} = require("../controllers/hotel");
const {getUserById} = require("../controllers/user");
const {isLoggedIn, isAuthenticated, isAdmin} = require("../controllers/auth");

// Params
router.param("userId", getUserById)
router.param("hotelId", getHotelById)

// Actual Routes
// Create
router.post("/hotel/create/:userId", isLoggedIn, isAuthenticated, isAdmin, createHotel)

// Read
router.get("/hotel/:hotelId", getHotel)
router.get("/hotel/photo/:hotelId", photo)

// Update
router.put("/hotel/:hotelId/:userId", isLoggedIn, isAuthenticated, isAdmin, updateHotel)

// Delete
router.delete("/hotel/:hotelId/:userId", isLoggedIn, isAuthenticated, isAdmin, removeHotel)

// Listing
router.get("/hotels", getAllHotels)
router.get("/hotels/categories", getAllUniqueCategories)

module.exports = router;
