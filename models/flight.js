const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;
const DateDiff = require("date-diff");

const flightSchema = new mongoose.Schema({
    brand: {
        type: String,
        maxlength: 32
    },
    name: {
        type: String,
        maxlength: 32,
        required: true
    },
    price: {
        type: Number,
        required: true,
        maxlength: 32,
        trim: true
    },
    category: {
        type: ObjectId,
        ref: "Flight_Category"
    },
    description: {
        type: String,
        maxlength: 2000,
        trim: true
    },
    total_seats_count: {
        type: Number,
        required: true
    },
    seats_sold: {
        type: Number
    },
    source: {
        type: String,
        maxlength: 32
    },
    departure_time: {
        type: Date
    },
    destination: {
        type: String,
        maxlength: 32
    },
    arrival_time: {
        type: Date
    },
    travellers_list: {
        type: Array,
        default: []
    }
}, {timestamps: true})

flightSchema.virtual("duration")
    .get(function () {
        let diff = new DateDiff(this.arrival_time, this.departure_time)
        return diff.hours()
    })
flightSchema.virtual("seats_remaining")
    .get(function () {
        return (this.total_seats_count - this.seats_sold);
    })

module.exports = mongoose.model("Flight", flightSchema)
