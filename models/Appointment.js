const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema({
  parlorName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },       
  address: { type: String, required: true },  //?? salon ou user
  zipcode: { type: Number, required: true },  //================
  city: { type: String, required: true },     //================
  tatoo: [
    {
      position: { type: String, required: true },
      height: { type: Number, required: true },
      width: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Appointment", appointmentSchema);

