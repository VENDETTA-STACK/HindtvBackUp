var mongoose = require("mongoose");

var newSchema = mongoose.Schema({
  Name: String,
  Address: String,
  ContactPersonName: String,
  ContactPersonNumber: String,
  Email: String,
  GSTIN: String,
  Status: String,
  CompanyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
    required: true,
  },
  lat: Number,
  long: Number,
  Link: String,
  BufferTime: Number,
  //wifiName: String,
  SalaryDate: Number,
  MemoNumber: Number,
  LocationId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "location",
    required: true,
  }
});

const admin = mongoose.model("subcompany", newSchema);

module.exports = admin;
