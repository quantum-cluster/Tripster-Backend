const User = require("../models/user");
const Order = require("../models/order");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

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
    req.profile.photo = undefined;
    return res.json(req.profile);
}

exports.photo = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set("Content-Type", req.hotel.photo.contentType);
        return res.send(req.hotel.photo.data);
    }
    next();
}

exports.updateUser = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.json(400).json({
                error: err
            })
        }

        let user = req.profile

        // Updation code
        // Add/Merge all the fields in the 'fields(from formidable)' to the fields in the 'user'
        user = _.extend(user, fields)

        // Handle File here.
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "The maximum allowed file size is 3MB."
                })
            }

            // If the file being uploaded is < 3MB.
            user.photo.data = fs.readFileSync(file.photo.path);
            user.photo.contentType = file.photo.type;
        }

        // Save to DB
        user.save((err, updatedUser) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (!updatedUser) {
                return res.status(404).json({
                    error: "No such user exists"
                })
            }
            res.json(updatedUser)
        })
    })
}
// exports.updateUser = (req, res) => {
//     User.findByIdAndUpdate(
//         req.profile._id,
//         {$set: req.body},
//         {new: true, useFindAndModify: false},
//         (err, updatedUser) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: err
//                 })
//             }
//             if (!updatedUser) {
//                 return res.status(404).json({
//                     error: "User doesn't exist!"
//                 })
//             }
//             updatedUser.encryptedPassword = undefined;
//             updatedUser.createdAt = undefined;
//             updatedUser.updatedAt = undefined;
//             return res.json(updatedUser);
//         }
//     )
// }

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
        let {_id, brand, name, description, category} = flight;
        flight_purchases.push({
            _id: _id,
            brand: brand,
            name: name,
            description: description,
            category: category
            // amount: req.body.order.amount,
            // flights_transaction_id: req.body.order.flights_transaction_id
        })
    })

    req.body.order.hotels.forEach(hotel => {
        let {_id, brand, name, description, category} = hotel;
        hotel_purchases.push({
            _id: _id,
            brand: brand,
            name: name,
            description: description,
            category: category
            // amount: req.body.order.amount,
            // hotels_transaction_id: req.body.order.hotels_transaction_id
        })
    })

    // Store both arrays in a DB.
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {
            $push: {
                flight_purchases: flight_purchases,
                hotel_purchases: hotel_purchases
            }
        },
        {new: true},
        (err, updatedPurchases) => {
            if (err) {
                return res.status(400).json({
                    error: err.body
                })
            }

            if (!updatedPurchases) {
                return res.status(404).json({
                    message: "Could not update the purchases list"
                })
            }

            // res.json(updatedPurchases);
            next();
        }
    )
}

