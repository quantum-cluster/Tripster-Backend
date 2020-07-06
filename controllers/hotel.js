const Hotel = require("../models/hotel");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getHotelById = (req, res, next, id) => {
    Hotel.findById(id)
        .populate("category")
        .exec((err, foundHotel) => {
            if (err) {
                return res.status(400).json({
                    error: err.message
                })
            }
            if (!foundHotel) {
                return res.status(404).json({
                    message: "No such hotel exists."
                })
            }
            req.hotel = foundHotel
            next()
        })
}

exports.createHotel = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }

        // Destructure 'fields' variable.
        const {brand, name, price, description, category, city, total_rooms} = fields;

        if (!brand || !name || !price || !description || !category || !city || !total_rooms) {
            return res.status(400).json({
                error: "Hotel must include all the given fields."
            })
        }

        let hotel = new Hotel(fields)

        // Handle File here.
        if (file.photo) {
            if (file.photo > 3000000) {
                return res.status(400).json({
                    error: "Maximum allowed file size is 3MB."
                })
            }

            // If the file being uploaded is < 3MB
            hotel.photo.data = fs.readFileSync(file.photo.path);
            hotel.photo.contentType = file.photo.type;
        }

        // Save to DB
        hotel.save((err, savedHotel) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (!savedHotel) {
                return res.status(404).json({
                    error: "Couldn't save to database."
                })
            }
            res.json(savedHotel)
        })
    })
}

exports.getHotel = (req, res) => {
    req.hotel.photo = undefined;
    return res.json(req.hotel)
}

// Middleware (This will make our app really fast since the photo won't be loaded on 'getHotel')
exports.photo = (req, res, next) => {
    if (req.hotel.photo.data) {
        res.set("Content-Type", req.hotel.photo.contentType);
        return res.send(req.hotel.photo.data);
    }
    next();
}

exports.removeHotel = (req, res) => {
    let hotel = req.hotel;
    hotel.remove((err, removedHotel) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        if (!removedHotel) {
            return res.json({
                error: "No such hotel exists."
            })
        }
        res.json(removedHotel)
    })
}

exports.updateHotel = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.json(400).json({
                error: err
            })
        }

        let hotel = req.hotel

        // Updation code
        // Add/Merge all the fields in the 'fields(from formidable)' to the fields in the 'hotel'
        hotel = _.extend(hotel, fields)

        // Handle File here.
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "The maximum allowed file size is 3MB."
                })
            }

            // If the file being uploaded is < 3MB.
            hotel.photo.data = fs.readFileSync(file.photo.path);
            hotel.photo.contentType = file.photo.type;
        }

        // Save to DB
        hotel.save((err, updatedHotel) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (!updatedHotel) {
                return res.status(404).json({
                    error: "No such hotel exists"
                })
            }
            res.json(updatedHotel)
        })
    })
}

exports.getAllHotels = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Hotel.find({})
        .select("-photo")
        .populate("category")
        .sort([[sortBy, "asc"]])
        .limit(limit)
        .exec((err, foundHotels) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (!foundHotels) {
                return res.status(404).json({
                    error: "No products available."
                })
            }
            res.json(foundHotels)
        })
}

exports.getAllUniqueCategories = (req, res) => {
    Hotel.distinct("category", {}, (err, categoriesArray) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        if (!categoriesArray) {
            return res.status(404).json({
                error: "No categories exist."
            })
        }
        res.json(categoriesArray)
    })
}

exports.updateRooms = (req, res, next) => {
    let myOperations = req.body.order.hotels.map(hotel => {
        return {
            updateOne: {
                filter: {_id: hotel._id},
                update: {$inc: {rooms_occupied: -hotel.count}}
            }
        }
    })

    Hotel.bulkWrite(myOperations, {}, (err, updatedHotels) => {
        if (err) {
            return res.status(400).json({
                error: err,
                message: "Bulk write failed"
            })
        }
        if (!updatedHotels) {
            return res.status(404).json({
                error: "Nothing updated"
            })
        }
        next()
    })
}
