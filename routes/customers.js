const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const { Customer, validate } = require("../models/customer");
const mongoDebugger = require("debug")("app:mongo");

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  mongoDebugger("Get all Customers...", customers);
  res.send(customers);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone,
  });

  await customer.save();
  res.send(customer);
});

router.put("/:id", auth, async (req, res) => {
  const { isGold, name, phone } = req.body;
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      isGold: isGold,
      name: name,
      phone: phone,
    },
    { new: true }
  );

  if (!customer)
    return res
      .status(404)
      .send("This customer with the given ID was not found.");

  res.send(customer);
});

router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer)
    return res
      .status(404)
      .send("This customer with the given ID was not found.");

  res.send(customer);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res
      .status(404)
      .send("This customer with the given ID was not found.");
  res.send(customer);
});

module.exports = router;
