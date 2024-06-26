const express = require("express");
const router = express.Router();
const {auth} = require("../../middleware/auth");
const {all, add, remove, getById, edit, removeMultiple} = require("../../controllers/old/income");

///api/income/
router.get("/", auth, all);

///api/income/:id
router.get("/:id", auth, getById);

///api/income/add
router.post("/add", auth, add);

///api/income/remove/:id
router.post("/remove/:id", auth, remove);

///api/income/remove
router.post("/remove", auth, removeMultiple);

///api/income/edit/:id
router.put("/edit/", auth, edit);

module.exports = router;