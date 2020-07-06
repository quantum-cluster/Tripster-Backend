const Flight = require("../models/flight");
const _ = require("lodash");

exports.getFlightById = (req, res, next, id) => {
    Flight.findById(id)
        .populate("category")
        .exec((err, foundFlight) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (!foundFlight) {
                return res.status(404).json({
                    error: "No such flight exists."
                })
            }
            req.flight = foundFlight
            next();
        })
}

exports.createFlight = (req, res) => {
    const flight = new Flight(req.body);
    flight.save((err, savedFlight) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        if (!savedFlight) {
            return res.status(400).json({
                error: "Couldn't save the flight."
            })
        }
        res.json(savedFlight);
    })
}

exports.getFlight = (req, res) => {
    return res.json(req.flight);
}

exports.removeFlight = (req, res) => {
    let flight = req.flight;
    flight.remove((err, removedFlight) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        if (!removedFlight) {
            return res.status(404).json({
                error: "No such flight exists anyway."
            })
        }
        res.json(removedFlight);
    })
}

exports.updateFlight = (req, res) => {
    let flight = req.flight;
    flight = _.extend(flight, req.body)

    flight.save((err, updatedFlight) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        if (!updatedFlight) {
            return res.status(500).json({
                error: "Couldn't update the Flight."
            })
        }
        res.json(updatedFlight);
    })
}

exports.getAllFlights = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Flight.find({})
        .populate("category")
        .sort([[sortBy, "asc"]])
        .limit(limit)
        .exec((err, foundFlights) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (!foundFlights) {
                return res.status(404).json({
                    error: "No flights exist."
                })
            }
            res.json(foundFlights);
        })
}

exports.getAllUniqueCategories = (req, res) => {
    Flight.distinct("category", {}, (err, categoriesArray) => {
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
        res.json(categoriesArray);
    })
}

exports.updateSeats = (req, res, next) => {
    let myOperations = req.body.order.flights.map(flight => {
        return {
            updateOne: {
                filter: {_id: flight._id},
                update: {$inc: {seats_sold: +flight.count}}
            }
        }
    })

    Flight.bulkWrite(myOperations, {}, (err, updatedFlights) => {
        if (err) {
            return res.status(400).json({
                error: err,
                message: "Bulk operation failed."
            })
        }
        if (!updatedFlights) {
            return res.status(404).json({
                error: "Nothing updated"
            })
        }
        next();
    })
}
