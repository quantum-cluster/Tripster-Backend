const mongoose = require("mongoose");

const flight_categorySchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 32,
        trim: true,
        required: true,
        unique: true
    }
}, {timestamps: true})

module.exports = mongoose.model("Flight_Category", flight_categorySchema)
