const Flight_Category = require("../models/flight_category");

exports.getFlightCategoryById = (req, res, next, id) => {
    Flight_Category.findById(id, (err, foundFlightCategory) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        if (!foundFlightCategory) {
            return res.status(404).json({
                error: "No such category exists."
            })
        }
        req.flight_category = foundFlightCategory;
        next();
    })
}

exports.createFlightCategory = (req, res) => {
    const flight_category = new Flight_Category(req.body)
    flight_category.save((err, savedFlightCategory) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        if (!savedFlightCategory) {
            return res.status(404).json({
                error: "DB ERROR: Category couldn't be created."
            })
        }
        res.json(savedFlightCategory)
    })
}

exports.getFlightCategory = (req, res) => {
    return res.json(req.flight_category)
}

exports.getAllFlightCategories = (req, res) => {
    Flight_Category.find({}, (err, foundFlightCategories) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        if (!foundFlightCategories) {
            return res.status(404).json({
                error: "No categories exist."
            })
        }
        res.json(foundFlightCategories)
    })
}

exports.updateFlightCategory = (req, res) => {
    const flightCategory = req.flight_category;
    flightCategory.name = req.body.name;

    flightCategory.save((err, updatedFlightCategory) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        if (!updatedFlightCategory) {
            return res.status(404).json({
                error: "Couldn't update Flight Category."
            })
        }
        res.json(updatedFlightCategory)
    })
}

exports.removeFlightCategory = (req, res) => {
    const flightCategory = req.flight_category;

    flightCategory.remove((err, removedFlightCategory) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        if (!removedFlightCategory) {
            return res.status(404).json({
                error: "No such flight category exists"
            })
        }
        res.json(removedFlightCategory)
    })
}
