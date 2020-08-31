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
  if ((req.body.type = "getdata")) {
    //convertedDate();
    var date = "20/07/2020";
    var attendance  = await attendeanceSchema.find({ Date: date}).populate("EmployeeId");
    for (var index = 0; index < attendance.length; index++) {
      var SubCompany = await subcompanySchema.findById(attendance[index].EmployeeId["SubCompany"]);
      console.count(SubCompany.Name);
    }
    /*await attendeanceSchema.find({ Date: date }, (err, record) => {
      var result = {};
      if (err) {
        result.Message = "Record Not Found";
        result.Data = [];
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "Record Not Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "Record Found";
          result.Data = record;
          result.isSuccess = true;
        }
        res.json(result);
      }
    });*/
  }
});

module.exports = router;
