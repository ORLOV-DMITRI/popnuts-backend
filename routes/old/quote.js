const express = require("express");
const router = express.Router();
const {getQuote} = require("../../controllers/old/quote");

///api/total/
router.get("/", getQuote);


module.exports = router;