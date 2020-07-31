var mongoose = require("mongoose");

var newSchema = mongoose.Schema({
  userName: String,
  password: String,
});

const admin = mongoose.model("admin", newSchema);

module.exports = admin;
