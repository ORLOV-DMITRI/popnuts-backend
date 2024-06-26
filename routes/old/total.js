const express = require("express");
const router = express.Router();
const {auth} = require("../../middleware/auth");
const {available} = require("../../controllers/old/total");

///api/total/
router.get("/", auth, available);


module.exports = router;