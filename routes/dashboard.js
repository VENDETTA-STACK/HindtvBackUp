/*Importing Modules */
var express = require("express");
var router = express.Router();
var subcompanySchema = require("../models/subcompany.models");
var attendeanceSchema = require("../models/attendance.models");
var employeeSchema = require("../models/employee.model");
const geolib = require("geolib");
const { mongoose } = require("mongoose");
var dateFormat = require("dateformat");
const e = require("express");
var moment = require("moment-timezone");
var memoSchema = require("../models/memo.model");
/*Importing Modules */

var convertedDate = function () {
  var now = new Date();
  date = dateFormat(now, "isoDateTime");
  date =
    date[8] +
    date[9] +
    "/" +
    date[5] +
    date[6] +
    "/" +
    date[0] +
    date[1] +
    date[2] +
    date[3];
  return date;
};

router.post("/", async (req, res) => {
  // if (req.body.type = "getdata") {
  //   var result = {};
  //   convertedDate(); //fetch date
  //   try{
  //       var date = convertedDate();
  //       var data = [];
  //       var Attendance;
  //       var SubCompanyName;
  //       let test =  await attendeanceSchema.find().populate({
  //         path: 'EmployeeId',
  //         populate:'SubCompany'
  //       });
  //       var subcompany = await subcompanySchema.find();
  //       for (var index = 0; index < subcompany.length; index++) {
  //         SubCompanyName = subcompany[index].Name;
  //         var employee = await employeeSchema.find({SubCompany: subcompany[index]._id,});
  //         for (var employeeIndex = 0;employeeIndex < employee.length;employeeIndex++) {
  //             attendance = await attendeanceSchema.find({Date: date,EmployeeId: employee[employeeIndex]._id});
  //             Attendance = attendance.length;
  //         }
  //         data[index] = { Attendance, SubCompanyName };
  //       }
  //       result.Message = "Record Found";
  //       result.Data = data;
  //       result.isSuccess  = true;
  //   }
  //   catch(err){
  //     result.Message = "Record Not Found";
  //     result.Data = [];
  //     result.isSuccess  = false;
  //   }
  //   res.json(result);

  // } else 
  if(req.body.type == "getempdata"){
    var date = moment()
      .tz("Asia/Calcutta")
      .format("DD MM YYYY, h:mm:ss a")
      .split(",")[0];
    date = date.split(" ");
    date = date[0] + "/" + date[1] + "/" + date[2];
    var record = await attendeanceSchema.find({Date:date,Status:"in"});
    var result = {};
    if(record.length == 0){
      result.Message = "No Data Found.";
      result.Data = [];
      result.isSuccess = false;
    } else{
      result.Message = "Data Found.";
      result.Data = record.length;
      result.isSuccess = true;
    }
    res.json(result);
  } else if(req.body.type == "countmemo"){
    var date = moment()
      .tz("Asia/Calcutta")
      .format("DD MM YYYY, h:mm:ss a")
      .split(",")[0];
    date = date.split(" ");
    date = date[0] + "/" + date[1] + "/" + date[2];
    var record = await memoSchema.find({Date:date});
    var result = {};
    if(record.length == 0){
      result.Message = "No Data Found.";
      result.Data = [];
      result.isSuccess = false;
    } else{
      result.Message = "Data Found.";
      result.Data = record.length;
      result.isSuccess = true;
    }
    res.json(result);
  }
});

module.exports = router;
