const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  lastname: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  address: { type: String, required: true },
  zipcode: { type: Number, required: true },
  city: { type: String, required: true },
  profilePic: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('Users', userSchema)
