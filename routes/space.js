const express = require("express");
const router = express.Router();
const {auth} = require("../middleware/auth");
const {all, add, remove, edit, getById} = require("../controllers/space");

///api/space/
router.get("/", auth, all);

///api/space/:id
router.get("/:id", auth, getById);

///api/space/add
router.post("/add", auth, add);

///api/space/remove
router.delete("/remove", auth, remove);

///api/space/edit/:id
router.put("/edit/", auth, edit);


module.exports = router;