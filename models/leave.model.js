var mongoose = require("mongoose");

var newSchema = mongoose.Schema({
  EmployeeId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "employee",
    required: true,
  },
  SubCompany:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "subcompany",
    required: true,
  },
  Company:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
    required: true,
  },
  Reason:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "masterLeaveLevel",
    required: true,
  },
  Description: String,
  ApplyDate: Date, 
  StartDate:Date,
  EndDate:Date,
  LeaveType : String,
  LeavePeriod:Number,
  LeaveStatus:String,
});

const admin = mongoose.model("leave", newSchema);
module.exports = admin;
