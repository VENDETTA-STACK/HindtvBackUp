var express = require("express");
var router = express.Router();
var moment = require("moment-timezone");
var employeeSchema = require("../models/employee.model");
var attendeanceSchema = require("../models/attendance.models");
var memoSchema = require("../models/memo.model");
var Excel = require("exceljs");
const mongoose = require("mongoose");
var _ = require("lodash");

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

router.post("/testing", async (req, res) => {
  record = await attendeanceSchema
    .find({
      Date: {
        $gte: req.body.startdate,
        $lte: req.body.enddate,
      },
    })
    .select("Status Date Time Day")
    .populate({
      path: "EmployeeId",
      select: "Name",
      match: {
        SubCompany: mongoose.Types.ObjectId(req.body.company),
      },
    });
  if (record.length >= 0) {
    var result = [];
    record.map(async (records) => {
      if (records.EmployeeId != null) {
        result.push(records);
      }
    });
    var memoresult = result;

    if (result.length >= 0) {
      var result = _.groupBy(result, "EmployeeId.Name");
      result = _.forEach(result, function (value, key) {
        result[key] = _.groupBy(result[key], function (item) {
          return item.Date;
        });
      });
      result = _.forEach(result, function (value, key) {
        _.forEach(result[key], function (value, key1) {
          result[key][key1] = _.groupBy(result[key][key1], function (item) {
            return item.Status;
          });
        });
      });
      try {
        var workbook = new Excel.Workbook();
        var worksheet = workbook.addWorksheet("Attendance Report");
        var worksheet1 = workbook.addWorksheet("Memo Report");
        worksheet.columns = [
          { header: "Employee Name", key: "Name", width: 32 },
          { header: "Date", key: "Date", width: 32 },
          { header: "Day", key: "Day", width: 15 },
          { header: "Status", key: "Status", width: 15 },
          { header: "In Time", key: "InTime", width: 15 },
          { header: "Out Time", key: "OutTime", width: 15 },
          {
            header: "Total Working Hour",
            key: "DifferenceTime",
            width: 28,
          },
        ];

        worksheet1.columns = [
          { header: "Employee Name", key: "Name", width: 32 },
          { header: "Memo Type", key: "Type", width: 15 },
          { header: "Start and End Date", key: "Date", width: 30 },
          { header: "Memo Accepted", key: "Accepted", width: 15 },
          { header: "Memo Disapproved", key: "Disapproved", width: 15 },
        ];

        for (var key in result) {
          for (var key1 in result[key]) {
            var i = 0;
            for (var key2 in result[key][key1]) {
              if (key2 == "in") {
                worksheet.addRow({
                  Name: key,
                  Date: key1,
                  Day: result[key][key1][key2][i].Day,
                  Status: "P",
                  InTime: result[key][key1][key2][i].Time,
                  OutTime: result[key][key1]["out"][i].Time,
                  DifferenceTime: calculateTime(
                    result[key][key1][key2][i].Time,
                    result[key][key1]["out"][i].Time
                  ),
                });
              }
            }
            i++;
          }
        }
        for (i = 0; i < memoresult.length; i++) {
          var memoData = await memoSchema
            .find({
              Eid: memoresult[i].EmployeeId._id,
              Type: memoresult[i].Status,
              Date: {
                $gte: req.body.startdate,
                $lte: req.body.enddate,
              },
            })
            .populate("Eid", "Name");
          var groupmemo = _.groupBy(memoData, "Eid.Name");
          var approved = 0,
            disapproved = 0;
          console.log(groupmemo);
          for (var key in groupmemo) {
            for (j = 0; j < groupmemo[key].length; j++) {
              if (groupmemo[key][j].Status == true) {
                approved++;
              } else {
                disapproved++;
              }
            }
            worksheet1.addRow({
              Name: key,
              Type: groupmemo[key][0].Type,
              Date: req.body.startdate + " - " + req.body.enddate,
              Accepted: approved,
              Disapproved: disapproved,
            });
          }
        }

        await workbook.xlsx.writeFile("./reports/" + req.body.name + ".xlsx");
        var result = {
          Message: "Excel Sheet Created",
          Data: req.body.name + ".xlsx",
          isSuccess: true,
        };
        res.json(result);
      } catch (err) {
        console.log("OOOOOOO this is the error: " + err);
      }
    } else {
      var result = {
        Message: "Excel Sheet Not Created",
        Data: "No Data Found",
        isSuccess: false,
      };
      res.json(result);
    }
  } else {
    var result = {
      Message: "Excel Sheet Not Created",
      Data: "No Data Found",
      isSuccess: false,
    };
    res.json(result);
  }
});

function calculateTime(inTime, outTime) {
  var startTime = moment(inTime, "HH:mm:ss a");
  var endTime = moment(outTime, "HH:mm:ss a");
  var duration = moment.duration(endTime.diff(startTime));
  var hours = parseInt(duration.asHours());
  var minutes = parseInt(duration.asMinutes()) % 60;
  return hours + " hour and " + minutes + " minutes.";
}

router.post("/getotp", (req, res) => {
  var result = {};
  result.Message = "OPT";
  result.Data = 0;
  result.isSuccess = true;
  res.json(result);
});

module.exports = router;
