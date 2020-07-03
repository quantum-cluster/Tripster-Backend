const {Order} = require("../models/order")

exports.getOrderById = (req, res, next, id) => {
    Order.findById(id)
        .populate("flight.flight", "name price")
        .populate("hotels.hotel", "name, price")
        .exec((err, foundOrder) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (!foundOrder) {
                return res.status(404).json({
                    error: "Order not found 😟"
                })
            }
            req.order = foundOrder;
            res.json(foundOrder);
            next();
        })
}

exports.createOrder = (req, res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((err, savedOrder) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        if (!savedOrder) {
            return res.status(500).json({
                error: "Internal Server Error: Couldn't create order."
            })
        }
    })
}

exports.getAllOrders = (req, res) => {
    Order.find({})
        .populate("user", "_id fName lName")
        .exec((err, foundOrders) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (!foundOrders) {
                return res.status(404).json({
                    error: "No orders found"
                })
            }
            res.json(foundOrders)
        })
}

exports.updateStatus = (req, res) => {
    Order.update(
        {_id: req.body.orderId},
        {$set: {status: req.body.status}},
        (err, updatedOrders) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (!updatedOrders) {
                return res.json({
                    error: "Couldn't update anything"
                })
            }
            res.json(updatedOrders);
        }
    )
}

exports.getOrderStatus = (req, res) => {
    return res.json(Order.schema.path("status").enumValues)
}
