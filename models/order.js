const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const itemsInCartSchema = new mongoose.Schema({
    flight: {
        type: ObjectId,
        ref: "Flight"
    },
    hotel: {
        type: ObjectId,
        ref: "Hotel"
    },
    flight_name: {
        type: String
    },
    hotel_name: {
        type: String
    },
    days_of_stay: {
        type: Number
    },
    price: {
        type: Number
    }
})

const ItemsInCart = mongoose.model("ItemsInCart", itemsInCartSchema);

const orderSchema = new mongoose.Schema({
    purchases: [itemsInCartSchema],
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
    user: {
        type: ObjectId,
        ref: "User"
    }
}, {timestamps: true})

const Order = mongoose.model("Order", orderSchema)

module.exports = {Order, ItemsInCart}
