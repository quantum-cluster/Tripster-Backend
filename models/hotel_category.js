const mongoose = require("mongoose");

const hotel_categorySchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 32,
        trim: true,
        required: true,
        unique: true
    }
}, {timestamps: true})

module.exports = mongoose.model("Hotel_Category", hotel_categorySchema)
