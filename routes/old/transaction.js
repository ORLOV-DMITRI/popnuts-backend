const express = require("express");
const router = express.Router();
const {all, add} = require("../../controllers/old/transaction");

// api/transaction/history/:depositId
router.get("/",  all);


// api/transaction/add
router.post("/add",  add);


module.exports = router;