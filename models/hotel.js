const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;
const DateDiff = require("date-diff");

const hotelSchema = new mongoose.Schema({
    brand: {
        type: String,
        maxlength: 32,
        required: true
    },
    name: {
        type: String,
        maxlength: 32,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        maxlength: 32,
        trim: true
    },
    description: {
        type: String,
        maxlength: 2000,
        trim: true
    },
    category: {
        type: ObjectId,
        ref: "Hotel_Category"
    },
    city: {
        type: String,
        maxlength: 32,
        required: true,
        trim: true
    },
    street_address: {
        type: String,
        maxlength: 200,
        required: false,
        trim: true
    },
    guest_list: {
        type: Array,
        default: []
    }
})

module.exports = new mongoose.model("Hotel", hotelSchema)
