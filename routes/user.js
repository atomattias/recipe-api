var express = require("express");
var router = express.Router();
const auth = require("../middleware/auth");

var user_controller = require("../controllers/userController");

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get("/", auth, user_controller.index);

router.get("/list", user_controller.list);

// POST request for registration
router.post("/register", user_controller.register);

// POST request for login
router.post("/login", user_controller.login);

// POST request for logout
router.get("/logout", auth, user_controller.logout);

// POST request for user update
router.post("/update", auth, user_controller.update);

module.exports = router;
