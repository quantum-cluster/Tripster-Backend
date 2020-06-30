const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;
const DateDiff = require("date-diff");

const flightSchema = new mongoose.Schema({
    brand: {
        type: String,
        maxlength: 32
    },
    seats_count: {
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
    }
})

flightSchema.virtual("duration")
    .get(function () {
        let diff = new DateDiff(this.arrival_time, this.departure_time)
        return diff.hours()
    })

module.exports = mongoose.model("Flight", flightSchema)
