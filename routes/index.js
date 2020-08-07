/*Importing Modules */
var express = require("express");
var router = express.Router();
var moment = require("moment-timezone");

var employeeSchema = require("../models/employee.model");
var attendeanceSchema = require("../models/attendance.models");
var subcompanySchema = require("../models/subcompany.models");
var timingSchema = require("../models/timing.models");
var Excel = require("exceljs");

/*Importing Modules */

/*Post request for different routes
  Different POST request
  /birthday - to give birthday display on mobile app page
  /beforeattendaance - to display whether to duty in or duty out buuton should come
  /testing - bulk update(testing mode) need to be shifted to bulk.js.
  /getotp - For IOS version.
*/

router.post("/birthday", async (req, res) => {
  var date = moment()
    .tz("Asia/Calcutta")
    .format("DD MM YYYY, h:mm:ss a")
    .split(",")[0];
  date = date.split(" ");
  date = date[0] + "/" + date[1] + "/" + date[2];
  var record = await employeeSchema
    .find({ DOB: date })
    .populate("SubCompany", "Name");
  var result = {};
  if (record.length == 0) {
    result.Message = "Birthday Not Found";
    result.Data = [];
    result.isSuccess = false;
  } else {
    result.Message = "Birthday Found";
    result.Data = [];
    for (i = 0; i < record.length; i++) {
      data = {
        Message: "Many many happy returns of the day from DL Team",
        From: "DL - Team",
        Name: record[i].Name,
        Subcompany: record[i].SubCompany.Name,
        Mobile: record[i].Mobile,
      };
      result.Data.push(data);
    }
    result.isSuccess = true;
  }
  res.json(result);
});

router.post("/beforeattendance", (req, res) => {
  var date = moment()
    .tz("Asia/Calcutta")
    .format("DD MM YYYY, h:mm:ss a")
    .split(",")[0];
  date = date.split(" ");
  date = date[0] + "/" + date[1] + "/" + date[2];
  attendeanceSchema.find(
    { EmployeeId: req.body.id, Date: date, Status: "in" },
    (err, record) => {
      var result = {};
      if (err) {
        result.Message = "No Attendance Found";
        result.Data = [];
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "No Attendance Found";
          result.Data = [
            {
              duty: "in",
            },
          ];
          result.isSuccess = true;
        } else {
          result.Message = "Attendance Found";
          result.Data = [
            {
              duty: "out",
            },
          ];
          result.isSuccess = true;
        }
      }
      res.json(result);
    }
  );
});

router.post("/getotp", (req, res) => {
  var result = {};
  result.Message = "OPT";
  result.Data = 0;
  result.isSuccess = true;
  res.json(result);
});

router.post("/testing", async (req, res) => {});

router.post("/testing1", async (req, res) => {
  res.json(req.file);
});

module.exports = router;
