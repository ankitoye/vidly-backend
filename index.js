const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const users = require("./routes/users");
const rentals = require("./routes/rentals");
const app = express();
const mongoose = require("mongoose");
const startupDebugger = require("debug")("app:startup");

mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    startupDebugger("Connected to MongoDB");
  })
  .catch((err) => startupDebugger("Could not connect to MongoDB...", err));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);

startupDebugger("Starting");

const port = process.env.PORT || 3000;
app.listen(port, () => startupDebugger(`Listening on port ${port}...`));
