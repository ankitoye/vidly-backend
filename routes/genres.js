const express = require("express");
const { Genre, validate } = require("../models/genre");
const router = express.Router();
const genresDebugger = require("debug")("app:genres");
const mongoDebugger = require("debug")("app:mongo");

router.get("/", async (req, res) => {
  try {
    const courses = await Genre.find().sort("name");
    res.send(courses);
  } catch (error) {
    mongoDebugger("Error ", error.message);
  }
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({
    name: req.body.name,
  });

  await genre.save();
  // mongoDebugger("Result...", genre);
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );

  if (!genre)
    return res.status(404).send("This genre with the given ID was not found.");

  mongoDebugger(genre);
  res.send(genre);
});

router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre)
    return res.status(404).send("This genre with the given ID was not found.");

  res.send(genre);
});

router.get("/:id", async (req, res) => {
  try {
    const result = await Genre.findById(req.params.id);
    if (!result)
      return res
        .status(404)
        .send("This genre with the given ID was not found.");
    res.send(result);
  } catch (error) {
    mongoDebugger("Error ", error.message);
    res.sendStatus(400);
  }
});

module.exports = router;
