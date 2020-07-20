var mongoose = require("mongoose");

var newSchema = mongoose.Schema({
  EmployeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employee",
    required: true,
  },
  Day: String,
  Time: String,
  Date: String,
  Image: String,
  Status: String,
  Area: String,
  Elat: String,
  Elong: String,
  Distance: String,
  Memo: Number,
});

const admin = mongoose.model("attendance", newSchema);

module.exports = admin;
