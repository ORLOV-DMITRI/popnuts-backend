const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { getAllFavorites,toggleFavorite } = require("../controllers/favorites");

///api/favorites/
router.get("/", auth, getAllFavorites);

///api/favorites/add
router.post("/toggle", auth, toggleFavorite);



module.exports = router;
