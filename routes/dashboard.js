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
  if (req.body.type = "getdata") {
    var result = {};
    convertedDate(); //fetch date
    
    try{
        var date = convertedDate();
        var data = [];
        var Attendance;
        var SubCompanyName;
        let test =  await attendeanceSchema.find().populate({
          path: 'EmployeeId',
          populate:'SubCompany'
        });
        //console.log(JSON.stringify(test));
        var subcompany = await subcompanySchema.find();
        for (var index = 0; index < subcompany.length; index++) {
          SubCompanyName = subcompany[index].Name;
          var employee = await employeeSchema.find({SubCompany: subcompany[index]._id,});
          for (var employeeIndex = 0;employeeIndex < employee.length;employeeIndex++) {
              attendance = await attendeanceSchema.find({Date: date,EmployeeId: employee[employeeIndex]._id});
              Attendance = attendance.length;
          }
          data[index] = { Attendance, SubCompanyName };
        }
        //console.log(data.length);
        result.Message = "Record Found";
        result.Data = data;
        result.isSuccess  = true;
    }
    catch(err){
      result.Message = "Record Not Found";
      result.Data = [];
      result.isSuccess  = false;
    }
    res.json(result);
    
  }
});

module.exports = router;
