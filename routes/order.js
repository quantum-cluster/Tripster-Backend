const express = require("express");
const router = express.Router();
const {
  getOrderById,
  createOrder,
  getAllOrders,
  updateStatus,
  getOrderStatus,
} = require("../controllers/order");
const { updateRooms } = require("../controllers/hotel");
const { updateSeats } = require("../controllers/flight");
const { isLoggedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");

// Params
router.param("orderId", getOrderById);
router.param("userId", getUserById);

// Actual Routes
// Create
router.post(
  "/order/create/:userId",
  isLoggedIn,
  isAuthenticated,
  pushOrderInPurchaseList,
  // updateSeats,
  // updateRooms,
  createOrder
);

// Read
router.get(
  "/order/all/:userId",
  isLoggedIn,
  isAuthenticated,
  isAdmin,
  getAllOrders
);

// Status of Order
router.get(
  "/order/status/:userId",
  isLoggedIn,
  isAuthenticated,
  isAdmin,
  getOrderStatus
);

// Update
router.put(
  "/order/:orderId/status/:userId",
  isLoggedIn,
  isAuthenticated,
  isAdmin,
  updateStatus
);

module.exports = router;
