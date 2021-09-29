require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const cors = require("cors");
var router = express.Router();

// Routers
var userRouter = require("./routes/user");
var recipeRouter = require("./routes/recipe");

const app = express();
app.use(cors());
app.use(express.json({ limit: "100mb" }));

// routes to middleware chain
app.use("/user", userRouter);
app.use("/recipe", recipeRouter);

// This should be the last route else any after it won't work
app.use("*", (req, res) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "This is annoying!",
    },
  });
});

module.exports = app;
