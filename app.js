const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();
const app = express();


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));


app.use("/api/user", require("./routes/users"));
app.use("/api/favorites", require("./routes/favorites"));
app.use("/api/basket", require("./routes/basket"));
app.use("/api/wallet", require("./routes/wallet"));
app.use("/api/order", require("./routes/order"));



module.exports = app;
