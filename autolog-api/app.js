/**
 * Main component of express pipeline
 */

// library imports
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
// error handler imports
const { NotFoundError } = require("./utils/errors");

// end of imports

// initialize express app
const app = express();

// display minimal output
app.use(morgan("tiny"));

// parse JSON bodies
app.use(express.json());

/**
 * Routes
 */

// health check
app.get("/", (req, res, next) => {
  try {
    res.status(200).json({ ping: "pong" });
  } catch (error) {
    next(error);
  }
});

/**
 * End of routes
 */

// 404 error handling
app.use((req, res, next) => {
  return next(new NotFoundError());
});

// generic error handling
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
