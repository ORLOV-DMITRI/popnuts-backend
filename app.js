const express = require("express");
const path = require("path");
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
app.use("/api/space", require("./routes/space"))
app.use("/api/board", require("./routes/board"))



// app.use("/api/cost", require("./routes/cost"));
// app.use("/api/income", require("./routes/income"));
// app.use("/api/deposit", require("./routes/deposit"));
// app.use("/api/transaction", require("./routes/transaction"));
// app.use("/api/total", require("./routes/total"));
// app.use("/api/quote", require("./routes/quote"));


module.exports = app;
