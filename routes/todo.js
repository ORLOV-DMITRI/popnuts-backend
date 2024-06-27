const express = require("express");
const router = express.Router();
const {auth} = require("../middleware/auth");
const {all, add, remove, edit} = require("../controllers/todo");

///api/todo/: todoId
router.get("/:cardId", auth, all);

///api/todo/add
router.post("/add", auth, add);

///api/todo/remove
router.delete("/remove", auth, remove);

///api/todo/edit/:id
router.put("/edit/", auth, edit);


module.exports = router;