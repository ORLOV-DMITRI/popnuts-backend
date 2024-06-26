const express = require("express");
const router = express.Router();
const {auth} = require("../../middleware/auth");
const {all, add, remove, getById, edit, removeMultiple} = require("../../controllers/old/cost");

///api/cost/
router.get("/", auth, all);

///api/cost/:id
router.get("/:id", auth, getById);


///api/cost/add
router.post("/add", auth, add);

///api/cost/remove/:id
router.post("/remove/:id", auth, remove);

///api/cost/remove/
router.post("/remove", auth, removeMultiple);

///api/cost/edit/:id
router.put("/edit/", auth, edit);

module.exports = router;