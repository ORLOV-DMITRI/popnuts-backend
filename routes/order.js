const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {checkoutOrder, getOrderHistory} = require("../controllers/order");


router.post("/checkout", auth, checkoutOrder);
router.get("/history", auth, getOrderHistory);

module.exports = router;
