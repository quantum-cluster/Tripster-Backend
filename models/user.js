const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lName: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    userInfo: {
        type: String,
        trim: true
    },
    encryptedPassword: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    booked_meal: {
        type: Boolean
    },
    flight_purchases: {
        type: Array,
        default: []
    },
    hotel_purchases: {
        type: Array,
        default: []
    },
    complimentary_breakfast: {
        type: Boolean
    }
}, {timestamps: true})

userSchema.virtual("password")
    .set(function (password) {
        this._password = password
        this.encryptedPassword = this.securePassword(password)
    })
    .get(function () {
        return this._password
    })

userSchema.methods = {
    securePassword:function (plainPassword) {
        if (!plainPassword) {
            return ""
        }
        try {
            return bcrypt.hashSync(plainPassword, saltRounds)
        } catch (e) {
            return ""
        }
    },
    authenticate: function (plainPassword) {
        return bcrypt.compareSync(plainPassword, this.encryptedPassword)
    }
}

module.exports = mongoose.model("User", userSchema)
