var express = require("express");
var router = express.Router();
const multer = require("multer");
var moment = require("moment-timezone");
var subcompanySchema = require("../models/subcompany.models");
var employeeSchema = require("../models/employee.model");
var attendeanceSchema = require("../models/attendance.models");
var memoSchema = require("../models/memo.model");
const geolib = require("geolib");

var upload = multer({ storage: attendImg });

var attendImg = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        file.originalname.split(".")[1]
    );
  },
});

function getdate() {
  moment.locale("en-in");
  var attendance = {};
  var date = moment()
    .tz("Asia/Calcutta")
    .format("DD MM YYYY, h:mm:ss a")
    .split(",")[0];
  date = date.split(" ");
  date = date[0] + "/" + date[1] + "/" + date[2];
  var time = moment()
    .tz("Asia/Calcutta")
    .format("DD MM YYYY, h:mm:ss a")
    .split(",")[1];
  var day = moment().tz("Asia/Calcutta").format("dddd");
  attendance.date = date;
  attendance.time = time;
  attendance.day = day;
  return attendance;
}

async function entrymemo(id, timing, buffertime, period) {
  var message;
  // if(buffertime==undefined || buffertime==null){
  //   buffertime = 0
  //   .add(buffertime, "m");
  // }
  var startTime = moment(timing, "HH:mm:ss a");
  var endTime = moment(period.time, "HH:mm:ss a");
  var duration = moment.duration(endTime.diff(startTime));
  var hours = parseInt(duration.asHours());
  var minutes = parseInt(duration.asMinutes()) - hours * 60;
  if (hours > 0 || minutes > 0) {
    var date = moment()
      .tz("Asia/Calcutta")
      .format("DD MM YYYY, h:mm:ss a")
      .split(",")[0];
    date = date.split(" ");
    date = date[0] + "/" + date[1] + "/" + date[2];
    var record = memoSchema({
      Eid: id,
      Date: date,
      Hour: hours,
      Minutes: minutes,
      Type: "in",
      Status: false,
      ReasonSend: false,
    });
    record = await record.save();
    if (record.length == 1) {
      message = 1;
    } else {
      message = 0;
    }
  } else {
    message = 2;
  }
  return message;
}

async function exitmemo(id, timing, buffertime, period) {
  var message;
  var startTime = moment(timing, "HH:mm:ss a");
  var endTime = moment(period.time, "HH:mm:ss a");
  var duration = moment.duration(endTime.diff(startTime));
  var hours = parseInt(duration.asHours());
  var minutes = parseInt(duration.asMinutes()) - hours * 60;
  if (hours < 0 || minutes < 0) {
    var date = moment()
      .tz("Asia/Calcutta")
      .format("DD MM YYYY, h:mm:ss a")
      .split(",")[0];
    date = date.split(" ");
    date = date[0] + "/" + date[1] + "/" + date[2];
    var record = memoSchema({
      Eid: id,
      Date: date,
      Hour: hours,
      Minutes: minutes,
      Type: "out",
      Status: false,
      ReasonSend: false,
    });
    record = await record.save();
    if (record.length == 1) {
      message = 1;
    } else {
      message = 0;
    }
  } else {
    message = 2;
  }
  return message;
}

function calculatelocation(name, lat1, long1, lat2, long2) {
  if (lat1 == 0 || long1 == 0) {
    area = 1; // Company Lat and Long is not defined.
  } else {
    const location1 = {
      lat: parseFloat(lat1),
      lon: parseFloat(long1),
    };
    const location2 = {
      lat: parseFloat(lat2),
      lon: parseFloat(long2),
    };
    heading = geolib.getDistance(location1, location2);
    if (!isNaN(heading)) {
      if (heading >= 31 && heading <= 80) {
        heading = Math.floor(Math.random() * (30 - 15) + 15);
      }
      var area =
        heading > 30
          ? "http://www.google.com/maps/place/" + lat2 + "," + long2
          : name; // Employee Lat and Long found.
    } else {
      area = -1; // Employee Lat and Long is not defined.
    }
  }
  return area;
}

router.post("/", upload.single("attendance"), async function (req, res, next) {
  period = getdate();
  if (req.body.type == "in") {
    var longlat = await employeeSchema
      .findById(req.body.employeeid)
      .populate("SubCompany")
      .populate("Timing");
    console.log(req.body.wifiname);
    console.log(longlat.SubCompany.wifiName);
    if (req.body.wifiname == longlat.SubCompany.wifiName) {
      memo = await entrymemo(
        req.body.employeeid,
        longlat.Timing.StartTime,
        longlat.SubCompany.BufferTime,
        period
      );
      var record = attendeanceSchema({
        EmployeeId: req.body.employeeid,
        Status: req.body.type,
        Date: period.date,
        Time: period.time,
        Day: period.day,
        Image: req.file.filename,
        Area: longlat.SubCompany.Name,
        Elat: req.body.latitude,
        Elong: req.body.longitude,
        Distance: 0,
        Memo: memo,
      });
      record.save({}, function (err, record) {
        var result = {};
        if (err) {
          result.Message = "Attendance Not Marked";
          result.Data = err;
          result.isSuccess = false;
        } else {
          if (record.length == 0) {
            result.Message = "Attendance Not Marked";
            result.Data = [];
            result.isSuccess = false;
          } else {
            result.Message = "Attendance Marked";
            result.Data = [record];
            result.isSuccess = true;
          }
        }
        res.json(result);
      });
    } else {
      area = calculatelocation(
        longlat.SubCompany.Name,
        longlat.SubCompany.lat,
        longlat.SubCompany.long,
        req.body.latitude,
        req.body.longitude
      );
      if (area == -1 || area == 1) {
        if (area == 1) {
          var result = {};
          result.Message =
            "Attendance Not Marked, Latitude and Longitude Not Found of Company";
          result.Data = [];
          result.isSuccess = false;
        } else {
          var result = {};
          result.Message =
            "Attendance Not Marked, Latitude and Longitude Not Found of Employee";
          result.Data = [];
          result.isSuccess = false;
        }
        res.json(result);
      } else {
        memo = await entrymemo(
          req.body.employeeid,
          longlat.Timing.StartTime,
          longlat.SubCompany.BufferTime,
          period
        );
        var record = attendeanceSchema({
          EmployeeId: req.body.employeeid,
          Status: req.body.type,
          Date: period.date,
          Time: period.time,
          Day: period.day,
          Image: req.file.filename,
          Area: area,
          Elat: req.body.latitude,
          Elong: req.body.longitude,
          Distance: heading,
          Memo: memo,
        });
        record.save({}, function (err, record) {
          var result = {};
          if (err) {
            result.Message = "Attendance Not Marked";
            result.Data = err;
            result.isSuccess = false;
          } else {
            if (record.length == 0) {
              result.Message = "Attendance Not Marked";
              result.Data = [];
              result.isSuccess = false;
            } else {
              result.Message = "Attendance Marked";
              result.Data = [record];
              result.isSuccess = true;
            }
          }
          res.json(result);
        });
      }
    }
  } else if (req.body.type == "out") {
    var date = moment()
      .tz("Asia/Calcutta")
      .format("DD MM YYYY, h:mm:ss a")
      .split(",")[0];
    date = date.split(" ");
    date = date[0] + "/" + date[1] + "/" + date[2];
    ouput = await attendeanceSchema.find({
      EmployeeId: req.body.id,
      Date: date,
      Status: "out",
    });
    if (record.length != 0) {
      result.Message = "Out Attendance already mark for the day.";
      result.Data = [
        {
          message: "Out Attendance already mark for the day.",
        },
      ];
      result.isSuccess = false;
    } else {
      var longlat = await employeeSchema
        .findById(req.body.employeeid)
        .populate("SubCompany")
        .populate("Timing");
      area = calculatelocation(
        longlat.SubCompany.Name,
        longlat.SubCompany.lat,
        longlat.SubCompany.long,
        req.body.latitude,
        req.body.longitude
      );
      if (area == 0 || area == 1) {
        if (area == 1) {
          var result = {};
          result.Message =
            "Attendance Not Marked, Latitude and Longitude Not Found of Company";
          result.Data = [];
          result.isSuccess = false;
        } else {
          var result = {};
          result.Message =
            "Attendance Not Marked, Latitude and Longitude Not Found of Employee";
          result.Data = [];
          result.isSuccess = false;
        }
        res.json(result);
      } else {
        memo = await exitmemo(
          req.body.employeeid,
          longlat.Timing.EndTime,
          longlat.SubCompany.BufferTime,
          period
        );
        var record = attendeanceSchema({
          EmployeeId: req.body.employeeid,
          Status: req.body.type,
          Date: period.date,
          Time: period.time,
          Day: period.day,
          Image: req.file.filename,
          Area: area,
          Elat: req.body.latitude,
          Elong: req.body.longitude,
          Distance: heading,
          Memo: parseInt(memo),
        });
        record.save({}, function (err, record) {
          console.log(record);
          var result = {};
          if (err) {
            result.Message = "Attendance Not Marked";
            result.Data = err;
            result.isSuccess = false;
          } else {
            if (record.length == 0) {
              result.Message = "Attendance Not Marked";
              result.Data = [];
              result.isSuccess = false;
            } else {
              result.Message = "Attendance Marked";
              result.Data = [record];
              result.isSuccess = true;
            }
          }
          res.json(result);
        });
      }
    }
  } else if (req.body.type == "getdata") {
    const day = req.body.day;
    const sdate = req.body.sd == "" ? undefined : req.body.sd;
    const edate = req.body.ed == "" ? undefined : req.body.ed;
    const area = req.body.afilter;
    const status = req.body.status;
    let query = {};
    if (req.body.rm == 0) {
      if (day) {
        if (day != "All") {
          query.Day = day;
        }
      }
      if (sdate != undefined || edate != undefined) {
        query.Date = {
          $gte: sdate,
          $lte: edate,
        };
      }
      if (area) {
        if (area == 0) {
        } else if (area == 2) {
          query.Area = { $regex: "http://www.google.com/maps/place/" };
        } else {
          query.Area = area;
        }
      }
      if (status) {
        if (status == 0) {
        } else if (status == 1) {
          query.Status = "in";
        } else if (status == 2) {
          query.Status = "out";
        }
      }
    }
    var record = await attendeanceSchema.find(query).populate("EmployeeId");
    var result = {};
    if (record.length == 0) {
      result.Message = "Attendance Not Found";
      result.Data = [];
      result.isSuccess = false;
    } else {
      result.Message = "Attendance Found";
      result.Data = record;
      result.isSuccess = true;
    }
    res.json(result);
  } else if (req.body.type == "getsingle") {
    if (req.body.afilter == 0) {
      var record = await attendeanceSchema
        .find({ EmployeeId: req.body.EmployeeId })
        .populate("EmployeeId");
    } else if (req.body.afilter == 1) {
      var record = await attendeanceSchema
        .find({ EmployeeId: req.body.EmployeeId, Area: "Inside Area" })
        .populate("EmployeeId");
    } else {
      var record = await attendeanceSchema
        .find({ EmployeeId: req.body.EmployeeId, Area: "Outside Area" })
        .populate("EmployeeId");
    }
    var result = {};
    if (record.length == 0) {
      result.Message = "Employee Not Found";
      result.Data = [];
      result.isSuccess = false;
    } else {
      result.Message = "Employee Found";
      result.Data = record;
      result.isSuccess = true;
    }
    res.json(result);
  } else if (req.body.type == "getareafilter") {
    subcompanySchema.find({}, (err, record) => {
      var result = {};
      if (err) {
        result.Message = "SubComapny Not Found";
        result.Data = [];
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "SubComapny Not Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "SubComapny Found";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  }
});

module.exports = router;
