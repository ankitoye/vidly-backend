const express = require("express");
const router = express.Router();
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const auth = require("../middleware/auth");
const mongoDebugger = require("debug")("app:mongo");

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name");
  //   mongoDebugger("Get all Movies...", movies);
  res.send(movies);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid Genre");

  const movie = new Movie({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    genre: { _id: genre._id, name: genre.name },
  });

  await movie.save();
  res.send(movie);
});

router.put("/:id",auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      genre: req.body.genre,
    },
    { new: true }
  );

  if (!movie)
    return res.status(404).send("This movie with the given ID was not found.");

  res.send(movie);
});

router.delete("/:id",auth, async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie)
    return res.status(404).send("This movie with the given ID was not found.");

  res.send(movie);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie)
    return res.status(404).send("This movie with the given ID was not found.");
  res.send(movie);
});

module.exports = router;
