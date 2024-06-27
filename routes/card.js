const express = require("express");
const router = express.Router();
const {auth} = require("../middleware/auth");
const {all, add, remove, edit} = require("../controllers/card");

///api/card/: boardId
router.get("/:boardId", auth, all);

///api/card/add
router.post("/add", auth, add);

///api/card/remove
router.delete("/remove", auth, remove);

///api/card/edit/:id
router.put("/edit/", auth, edit);


module.exports = router;