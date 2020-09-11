var mongoose = require("mongoose");

var newSchema = mongoose.Schema({
  name: String,
  password: String,
  mobilenumber: Number,
  email: String,
  allaccessubcompany: Boolean,
  accessCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subcompany",
    required: true,
  },
  Admin: {
    A: Number,
    U: Number,
    V: Number,
    D: Number,
  },
  Timing: {
    A: Number,
    U: Number,
    V: Number,
    D: Number,
  },
  Thought: {
    A: Number,
    U: Number,
    V: Number,
    D: Number,
  },
  SubCompany: {
    A: Number,
    U: Number,
    V: Number,
    D: Number,
  },
  Employee: {
    A: Number,
    U: Number,
    V: Number,
    D: Number,
  },
  Attendance: {
    A: Number,
    U: Number,
    V: Number,
    D: Number,
  },
  Memo: {
    A: Number,
    U: Number,
    V: Number,
    D: Number,
  },
  Report: {
    A: Number,
    U: Number,
    V: Number,
    D: Number,
  },
});

const admin = mongoose.model("admin", newSchema);

module.exports = admin;
/**
 * A -> All Permission 
 * U -> Only Update
 * V -> Only View
 * D -> Delete
 */