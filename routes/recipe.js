var express = require("express");
var router = express.Router();
const auth = require("../middleware/auth");

var recipe_controller = require("../controllers/recipeController");

router.get("/", recipe_controller.list);

router.get("/detail", recipe_controller.detail);

// POST request for registration
router.post("/create", auth, recipe_controller.create);

// POST request for user update
router.post("/update", auth, recipe_controller.update);

// POST request for login
router.get("/delete/:_id", auth, recipe_controller.delete);

module.exports = router;
