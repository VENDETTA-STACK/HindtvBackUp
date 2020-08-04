var mongoose = require("mongoose");

var newSchema = mongoose.Schema({
  name: String,
  password: String,
  mobilenumber: Number,
  email: String,
});

const admin = mongoose.model("admin", newSchema);

module.exports = admin;
