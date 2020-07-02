const express = require("express");
const router = express.Router();

const {
    getHotelCategoryById,
    createHotelCategory,
    getHotelCategory,
    getAllHotelCategories,
    updateHotelCategory,
    removeHotelCategory
} = require("../controllers/hotel_category")
const {getUserById} = require("../controllers/user")
const {isLoggedIn, isAuthenticated, isAdmin} = require("../controllers/auth")

// Params
router.param("hotelCategoryId", getHotelCategoryById)
router.param("userId", getUserById)

// Actual Routes
// Create
router.post("/hotel-category/create/:userId", isLoggedIn, isAuthenticated, isAdmin, createHotelCategory)

// Read
router.get("/hotel-category/:hotelCategoryId", getHotelCategory)
router.get("/hotel-categories", getAllHotelCategories)

// Update
router.put("/hotel-category/:hotelCategoryId/:userId", isLoggedIn, isAuthenticated, isAdmin, updateHotelCategory)

// Delete
router.delete("/hotel-category/:hotelCategoryId/:userId", isLoggedIn, isAuthenticated, isAdmin, removeHotelCategory)

module.exports = router