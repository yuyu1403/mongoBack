const express = require("express");
const res = require("express/lib/response");

const router = express.Router();
const Appointment = require("../models/Appointment");

//Inserts new Appointment
router.post("/", async (req, res) => {
  const appointment = new Appointment({
    parlorName: req.body.parlorName,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    zipcode: req.body.zipcode,
    city: req.body.city,
    tatoo: req.body.tatoo // check req for array?
  });
  try {
    const savedAppointment = await appointment.save();
    res.json(savedAppointment);
  } catch (err) {
    res.json({ message: error });
  }
});