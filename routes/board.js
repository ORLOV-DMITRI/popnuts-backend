const express = require("express");
const router = express.Router();
const {auth} = require("../middleware/auth");
const {all, add, remove, edit, getById} = require("../controllers/board");

///api/board/:workSpaceId
router.get("/:workSpaceId", auth, all);

///api/board/add
router.post("/add", auth, add);

///api/board/remove
router.delete("/remove", auth, remove);

///api/board/edit/:id
router.put("/edit/", auth, edit);


module.exports = router;