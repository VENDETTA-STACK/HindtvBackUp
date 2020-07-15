var mongoose = require("mongoose");

var newSchema = mongoose.Schema({
  Quote: String,
  Name: String,
  Status: Boolean,
});

const thought = mongoose.model("thought", newSchema);

module.exports = thought;
