require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3001;

const app = express();

// Path imports 👇
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const hotelRoutes = require("./routes/hotel")
const flightRoutes = require("./routes/hotel")
const hotelCategoryRoutes = require("./routes/hotel_category")
const flightCategoryRoutes = require("./routes/flight_category")
const orderRoutes = require("./routes/order")

// Middleware 👇
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// DB Connection 👇
mongoose.connect(
    process.env.DATABASE_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => {
        console.log("DB CONNECTED")
    })
    .catch(() => {
        console.log("😟 COULDN'T CONNECT TO THE DATABASE")
    })

// My Routes 👇
app.use("/api", authRoutes)
app.use("/api", userRoutes)
app.use("/api", hotelRoutes)
app.use("/api", flightRoutes)
app.use("/api", hotelCategoryRoutes)
app.use("/api", flightCategoryRoutes)
app.use("/api", orderRoutes)

app.listen(PORT, () => {
    console.log(`Port listening on http://localhost:${PORT}`)
})
