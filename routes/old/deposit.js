const express = require("express");
const router = express.Router();
const {auth} = require("../../middleware/auth");
const {all, add, remove, getById, edit, getTotalDeposits} = require("../../controllers/old/deposit");

///api/deposit/
router.get("/", auth, all);

///api/deposit/total
router.get("/total", auth, getTotalDeposits);

///api/deposit/:id
router.get("/:id", auth, getById);

///api/deposit/add
router.post("/add", auth, add);

///api/deposit/remove/:id
router.post("/remove/:id", auth, remove);

///api/deposit/edit/:id
router.put("/edit/", auth, edit);

module.exports = router;