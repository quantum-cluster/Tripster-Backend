const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, foundUser) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        if (!foundUser) {
            return res.status(404).json({
                error: "User doesn't exist"
            })
        }
        req.profile = foundUser;
        next()
    })
}

exports.getUser = (req, res) => {
    req.profile.encryptedPassword = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile);
}

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        req.profile._id,
        {$set: req.body},
        {new: true, useFindAndModify: false},
        (err, updatedUser) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (!updatedUser) {
                return res.status(404).json({
                    error: "User doesn't exist!"
                })
            }
            updatedUser.encryptedPassword = undefined;
            updatedUser.createdAt = undefined;
            updatedUser.updatedAt = undefined;
            return res.json(updatedUser);
        }
    )
}

exports.userPurchaseList = (req, res) => {
    Order.find({user: req.profile._id})
        .populate("user", "_id, fName, lName")
        .exec((err, order) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (!order) {
                return res.json({
                    error: "There is no order in this account!"
                })
            }
            res.json(order)
        })
}

exports.pushOrderInPurchaseList = (req, res, next) => {
    let flight_purchases = [];
    let hotel_purchases = [];

    req.body.order.flights.forEach(flight => {
        let {_id, name, description} = flight;
        flight_purchases.push({
            _id: _id,
            name: name,
            description: description,
            amount: req.body.order.amount,
            flights_transaction_id: req.body.order.flights_transaction_id
        })
    })

    req.body.order.hotels.forEach(hotel => {
        let {_id, name, description} = hotel;
        hotel_purchases.push({
            _id: _id,
            name: name,
            description: description,
            amount: req.body.order.amount,
            hotels_transaction_id: req.body.order.hotels_transaction_id
        })
    })

    // Store both arrays in a DB.
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {flight_purchases: flight_purchases}},
        {new: true},
        (err, updatedPurchases) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (!updatedPurchases) {
                return res.status(404).json({
                    error: "Could not update the purchases list."
                })
            }
            res.json(updatedPurchases)
            next();
        }
    )

    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {hotel_purchases: hotel_purchases}},
        {new: true},
        (err, updatedPurchases) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (!updatedPurchases) {
                return res.status(404).json({
                    error: "Could not update the purchases list."
                })
            }
            res.json(updatedPurchases)
            next();
        }
    )
}

