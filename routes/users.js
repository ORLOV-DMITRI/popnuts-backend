const express = require("express");
const router = express.Router();
const {login, current, register} = require("../controllers/user");
const {auth} = require('../middleware/auth')

// api/user/login
router.post("/login", login);

// api/user/register
router.post("/register", register);

// api/user/current
router.get("/current", auth, current);

module.exports = router;
