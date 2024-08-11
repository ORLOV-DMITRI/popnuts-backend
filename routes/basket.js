const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { getAllCartItems,addToCart , removeFromCart, removeItemFromCart} = require("../controllers/basket");

///api/basket/
router.get("/", auth, getAllCartItems);

///api/favorites/add
router.post("/add", auth, addToCart);
router.post("/remove", auth, removeFromCart);
router.post("/delete", auth, removeItemFromCart);



module.exports = router;
