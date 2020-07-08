const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const hotelInCartSchema = new mongoose.Schema({
    hotel: {
        type: ObjectId,
        ref: "Hotel"
    },
    hotel_name: {
        type: String
    },
    days_of_stay: {
        type: Number
    },
    price: {
        type: Number
    },
    checkin_datetime: {
        type: Date
    },
    checkout_datetime: {
        type: Date
    }
})

const HotelInCart = mongoose.model("HotelInCart", hotelInCartSchema);


const flightInCartSchema = new mongoose.Schema({
    flight: {
        type: ObjectId,
        ref: "Flight"
    },
    flight_name: {
        type: String
    },
    price: {
        type: Number
    },
    travel_date: {
        type: Date
    }
})

const FlightInCart = mongoose.model("FlightInCart", flightInCartSchema);

const orderSchema = new mongoose.Schema({
    flights: [flightInCartSchema],
    hotels: [hotelInCartSchema],
    transaction_id: {},
    amount: {
        type: Number
    },
    address: {
        type: String
    },
    updated: {
        type: Date
    },
    status: {
        type: String,
        default: "Received",
        enum: ["Cancelled", "Delivered", "Processing", "Received", "Approved"]
    },
    user: {
        type: ObjectId,
        ref: "User"
    }
}, {timestamps: true})

const Order = mongoose.model("Order", orderSchema)

module.exports = {Order, HotelInCart, FlightInCart}
