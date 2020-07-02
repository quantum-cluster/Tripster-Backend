const Hotel_Category = require("../models/hotel_category");

exports.getHotelCategoryById = (req, res, next, id) => {
    Hotel_Category.findById(id, (err, foundHotelCategory) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        if (!foundHotelCategory) {
            return res.status(404).json({
                error: "No such category exists."
            })
        }
        req.hotel_category = foundHotelCategory;
        next();
    })
}

exports.createHotelCategory = (req, res) => {
    const hotel_category = new Hotel_Category(req.body)
    hotel_category.save((err, savedHotelCategory) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        if (!savedHotelCategory) {
            return res.status(404).json({
                error: "DB ERROR: Category couldn't be created."
            })
        }
        res.json(savedHotelCategory)
    })
}

exports.getHotelCategory = (req, res) => {
    return res.json(req.hotel_category)
}

exports.getAllHotelCategories = (req, res) => {
    Hotel_Category.find({}, (err, foundHotelCategories) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        if (!foundHotelCategories) {
            return res.status(404).json({
                error: "No categories exist."
            })
        }
        res.json(foundHotelCategories)
    })
}

exports.updateHotelCategory = (req, res) => {
    const hotelCategory = req.hotel_category;
    hotelCategory.name = req.body.name;

    hotelCategory.save((err, updatedHotelCategory) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        if (!updatedHotelCategory) {
            return res.status(404).json({
                error: "Couldn't update Hotel Category."
            })
        }
        res.json(updatedHotelCategory)
    })
}

exports.removeHotelCategory = (req, res) => {
    const hotelCategory = req.hotel_category;

    hotelCategory.remove((err, removedHotelCategory) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        if (!removedHotelCategory) {
            return res.status(404).json({
                error: "No such hotel category exists"
            })
        }
        res.json(removedHotelCategory)
    })
}
