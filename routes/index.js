var express = require("express");
var router = express.Router();
var path = require("path");
const multer = require("multer");
var firebase = require("firebase-admin");
var moment = require("moment-timezone");
var companySchema = require("../models/company.models");
var subcompanySchema = require("../models/subcompany.models");
var employeeSchema = require("../models/employee.model");
var attendeanceSchema = require("../models/attendance.models");
var timingSchema = require("../models/timing.models");
var thoughtSchema = require("../models/thoughts.model");
var memoSchema = require("../models/memo.model");
const geolib = require("geolib");
const { fs } = require("fs");
const { promisify } = require("util");
var Excel = require("exceljs");
const tempfile = require("tempfile");
const { start } = require("repl");
const mongoose = require("mongoose");
var _ = require("lodash");

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

var upload = multer({ storage: attendImg });

router.post("/company", function (req, res, next) {
  if (req.body.type == "insert") {
    var record = new companySchema({
      Name: req.body.name,
      Address: req.body.address,
      ContactPersonName: req.body.contactpersonname,
      ContactPersonNumber: req.body.contactpersonnumber,
      Email: req.body.email,
      GSTIN: req.body.gstin,
    });
    record.save({}, function (err, record) {
      var result = {};
      if (err) {
        result.Message = "Company Not Inserted";
        result.Data = [];
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "Company Not Inserted";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "New Company Inserted";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  } else if (req.body.type == "getdata") {
    companySchema.find({}, (err, record) => {
      var result = {};
      if (err) {
        result.Message = "Company Not Found";
        result.Data = [];
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "Company Not Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "Company Found.";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  } else if (req.body.type == "getcompany") {
    companySchema.find({ _id: req.body.id }, (err, record) => {
      var result = {};
      if (err) {
        result.Message = "Company Not Found";
        result.Data = [];
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "Company Not Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "Company Found";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  } else if (req.body.type == "update") {
    companySchema.findByIdAndUpdate(
      req.body.id,
      {
        Name: req.body.name,
        Address: req.body.address,
        ContactPersonName: req.body.contactpersonname,
        ContactPersonNumber: req.body.contactpersonnumber,
        Email: req.body.email,
        GSTIN: req.body.gstin,
      },
      (err, record) => {
        var result = {};
        if (err) {
          result.Message = "Company Not Updated";
          result.Data = err;
          result.isSuccess = false;
        } else {
          if (record.length == 0) {
            result.Message = "Company Not Updated";
            result.Data = [];
            result.isSuccess = false;
          } else {
            result.Message = "Company Updated";
            result.Data = record;
            result.isSuccess = true;
          }
        }
        res.json(result);
      }
    );
  }
});

router.post("/subcompany", function (req, res, next) {
  if (req.body.type == "insert") {
    req.body.lat = req.body.lat == undefined ? 0 : req.body.lat;
    req.body.long = req.body.long == undefined ? 0 : req.body.long;
    var record = new subcompanySchema({
      Name: req.body.name,
      Address: req.body.address,
      ContactPersonName: req.body.contactpersonname,
      ContactPersonNumber: req.body.contactpersonnumber,
      Email: req.body.Email,
      GSTIN: req.body.GSTIN,
      Status: "Active",
      CompanyId: req.body.companyid,
      lat: parseFloat(req.body.lat),
      long: parseFloat(req.body.long),
      Link: req.body.googlelink,
      BufferTime: parseInt(req.body.buffertime),
    });
    record.save({}, function (err, record) {
      console.log(err);
      var result = {};
      if (err) {
        result.Message = "Record Not Inserted";
        result.Data = [];
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "Record Not Inserted";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "Record Inserted";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  } else if (req.body.type == "getdata") {
    subcompanySchema
      .find()
      .populate("CompanyId")
      .then((record) => {
        var result = {};
        if (record.length == 0) {
          result.Message = "SubCompany Not Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "SubCompany Inserted";
          result.Data = record;
          result.isSuccess = true;
        }
        res.json(result);
      });
  } else if (req.body.type == "getcompany") {
    companySchema.find({}, (err, record) => {
      var result = {};
      if (err) {
        result.Message = "Company Not Found";
        result.Data = [];
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "Company Not Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "Company Found";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  } else if (req.body.type == "getsinglecompany") {
    subcompanySchema.find({ CompanyId: req.body.CompanyId }, (err, record) => {
      var result = {};
      if (err) {
        result.Message = "SubCompany Not Found";
        result.Data = err;
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "SubCompany Not Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "SubCompany Found";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  } else if (req.body.type == "getsubcompanydetail") {
    subcompanySchema.find({ _id: req.body.id }, (err, record) => {
      var result = {};
      if (err) {
        result.Message = "SubCompany Not Found";
        result.Data = err;
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "SubCompany Not Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "SubCompany Found";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  } else if (req.body.type == "update") {
    req.body.lat = req.body.lat == undefined ? 0 : req.body.lat;
    req.body.long = req.body.long == undefined ? 0 : req.body.long;
    console.log(parseInt(req.body.buffertime));
    subcompanySchema.findByIdAndUpdate(
      req.body.id,
      {
        Name: req.body.name,
        Address: req.body.address,
        ContactPersonName: req.body.contactpersonname,
        ContactPersonNumber: req.body.contactpersonnumber,
        Email: req.body.Email,
        GSTIN: req.body.GSTIN,
        Status: "Active",
        CompanyId: req.body.companyid,
        lat: parseFloat(req.body.lat),
        long: parseFloat(req.body.long),
        Link: req.body.googlelink,
        BufferTime: parseInt(req.body.buffertime),
      },
      (err, record) => {
        var result = {};
        if (err) {
          result.Message = "SubCompany Not Updated";
          result.Data = err;
          result.isSuccess = false;
        } else {
          if (record.length == 0) {
            result.Message = "SubCompany Not Updated";
            result.Data = [];
            result.isSuccess = false;
          } else {
            result.Message = "SubCompany Updated";
            result.Data = record;
            result.isSuccess = true;
          }
        }
        res.json(result);
      }
    );
  }
});

router.post("/employee", async function (req, res, next) {
  if (req.body.type == "insert") {
    var record = new employeeSchema({
      FirstName: req.body.firstname,
      MiddleName: req.body.middlename,
      LastName: req.body.lastname,
      Name:
        req.body.firstname +
        " " +
        req.body.middlename +
        " " +
        req.body.lastname,
      Gender: req.body.gender,
      DOB: req.body.dob,
      MartialStatus: req.body.martialstatus,
      Mobile: req.body.mobile,
      Mail: req.body.mail,
      JoinDate: req.body.joindate,
      ConfirmationDate: req.body.confirmationdate,
      TerminationDate: req.body.terminationdate,
      Prohibition: req.body.prohibition,
      Idtype: req.body.idtype,
      IDNumber: req.body.idnumber,
      Department: req.body.department,
      Designation: req.body.designation,
      SubCompany: req.body.subcompany,
      Timing: req.body.timing,
    });
    record.save({}, function (err, record) {
      var result = {};
      if (err) {
        result.Message = "Record Not Inserted";
        result.Data = err;
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "Record Not Inserted";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "Record Inserted";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  } else if (req.body.type == "getdata") {
    var record = await employeeSchema.find({}).populate("SubCompany");
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
  } else if (req.body.type == "getsingledata") {
    var record = await employeeSchema
      .find({ _id: req.body.id })
      .populate("SubCompany");
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
  } else if (req.body.type == "getsubcompany") {
    subcompanySchema.find({}, function (err, record) {
      var result = {};
      if (record.length == 0) {
        result.Message = "Sub Company Not Found";
        result.Data = [];
        result.isSuccess = false;
      } else {
        result.Message = "Sub Company Found";
        result.Data = record;
        result.isSuccess = true;
      }
      res.json(result);
    });
  } else if (req.body.type == "getsubcompanyemployee") {
    employeeSchema.find({ SubCompany: req.body.SubCompany }, (err, record) => {
      var result = {};
      if (err) {
        result.Message = "Employee Not Found";
        result.Data = err;
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "Employee Not Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "Employee Found";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  } else if (req.body.type == "getemployee") {
    var record = await employeeSchema.find({ _id: req.body.id });
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
  } else if (req.body.type == "update") {
    employeeSchema.findByIdAndUpdate(
      req.body.id,
      {
        FirstName: req.body.firstname,
        MiddleName: req.body.middlename,
        LastName: req.body.lastname,
        Name:
          req.body.firstname +
          " " +
          req.body.middlename +
          " " +
          req.body.lastname,
        Gender: req.body.gender,
        DOB: req.body.dob,
        MartialStatus: req.body.martialstatus,
        Mobile: req.body.mobile,
        Mail: req.body.mail,
        JoinDate: req.body.joindate,
        ConfirmationDate: req.body.confirmationdate,
        TerminationDate: req.body.terminationdate,
        Prohibition: req.body.prohibition,
        Idtype: req.body.idtype,
        IDNumber: req.body.idnumber,
        Department: req.body.department,
        Designation: req.body.designation,
        SubCompany: req.body.subcompany,
        Timing: req.body.timing,
      },
      (err, record) => {
        var result = {};
        if (err) {
          result.Message = "Employee Not Updated";
          result.Data = err;
          result.isSuccess = false;
        } else {
          if (record.length == 0) {
            result.Message = "Employee Not Updated";
            result.Data = [];
            result.isSuccess = false;
          } else {
            result.Message = "Employee Updated";
            result.Data = record;
            result.isSuccess = true;
          }
        }
        res.json(result);
      }
    );
  }
});

router.post("/login", function (req, res, next) {
  if (req.body.type == "login") {
    employeeSchema.find({ Mobile: req.body.number }, function (err, record) {
      var result = {};
      if (err) {
        result.Message = "Employee Not Found";
        result.Data = [];
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "Employee Not Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "Employee Found";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  }
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
  var startTime = moment(timing, "HH:mm:ss a").add(buffertime, "m");
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

router.post("/attendance", upload.single("attendance"), async function (
  req,
  res,
  next
) {
  period = getdate();
  if (req.body.type == "in") {
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
  } else if (req.body.type == "out") {
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

router.post("/location", async (req, res) => {
  if (req.body.type == "getnamefrommobile") {
    record = await employeeSchema
      .find({ Mobile: req.body.mobile })
      .select("Name Mobile");
    res.json(record);
  } else {
    var dbRef = firebase.database().ref("Database");
    const data = await dbRef.once("value", function (snapshot) {
      return snapshot.val();
    });
    res.json(data);
  }
});

router.post("/timing", async (req, res) => {
  if (req.body.type == "insert") {
    var record = timingSchema({
      Name: req.body.name,
      StartTime: req.body.st,
      EndTime: req.body.et,
    });
    record.save({}, (err, record) => {
      var result = {};
      if (err) {
        result.Message = "Timing Not Inserted";
        result.Data = [];
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "Timing Not Inserted";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "New Timing Inserted";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  } else if (req.body.type == "getdata") {
    timingSchema.find({}, (err, record) => {
      var result = {};
      if (err) {
        result.Message = "Timing Not Found";
        result.Data = [];
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "Timing Not Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "Timing Found";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  } else if (req.body.type == "getsingletimedata") {
    timingSchema.find({ _id: req.body.id }, (err, record) => {
      var result = {};
      if (err) {
        result.Message = "Timing Not Inserted";
        result.Data = [];
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "Timing Not Inserted";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "New Timing Inserted";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  } else if (req.body.type == "update") {
    timingSchema.findByIdAndUpdate(
      req.body.id,
      { Name: req.body.name, StartTime: req.body.st, EndTime: req.body.et },
      (err, record) => {
        var result = {};
        if (err) {
          result.Message = "Timing Not Updated";
          result.Data = [];
          result.isSuccess = false;
        } else {
          if (record.length == 0) {
            result.Message = "Timing Not Updated";
            result.Data = [];
            result.isSuccess = false;
          } else {
            result.Message = "Timing Updated";
            result.Data = record;
            result.isSuccess = true;
          }
        }
        res.json(result);
      }
    );
  }
});

router.post("/thought", async (req, res) => {
  if (req.body.type == "insert") {
    var record = thoughtSchema({
      Quote: req.body.quote,
      // Name: req.body.name,
      Status: false,
    });
    record.save({}, (err, record) => {
      var result = {};
      if (err) {
        result.Message = "Thought Not Inserted";
        result.Data = [];
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "Thought Not Inserted";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "New Thought Inserted";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  } else if (req.body.type == "getalldata") {
    thoughtSchema.find({}, (err, record) => {
      var result = {};
      if (err) {
        result.Message = "No Thought Found";
        result.Data = [];
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "No Thought Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "Thought Found";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  } else if (req.body.type == "getsingledata") {
    thoughtSchema.findOne({ Status: true }, (err, record) => {
      var result = {};
      if (err) {
        result.Message = "No Thought Found";
        result.Data = [];
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "No Thought Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "Thought Found";
          result.Data = [];
          result.Data.push(record);
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  } else if (req.body.type == "getdata") {
    thoughtSchema.findById(req.body.id, (err, record) => {
      var result = {};
      if (err) {
        result.Message = "No Thought Found";
        result.Data = [];
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "No Thought Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "Thought Found";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  } else if (req.body.type == "update") {
    thoughtSchema.findByIdAndUpdate(
      req.body.id,
      {
        Quote: req.body.quote,
        // Name: req.body.name,
      },
      (err, record) => {
        var result = {};
        if (err) {
          result.Message = "Thought Not Updated";
          result.Data = [];
          result.isSuccess = false;
        } else {
          if (record.length == 0) {
            result.Message = "Thought Not Updated";
            result.Data = [];
            result.isSuccess = false;
          } else {
            result.Message = "Thought Updated";
            result.Data = record;
            result.isSuccess = true;
          }
        }
        res.json(result);
      }
    );
  } else if (req.body.type == "statusupdate") {
    if (req.body.sts == 0) {
      thoughtSchema.findByIdAndUpdate(
        req.body.id,
        { Status: false },
        (err, record) => {
          var result = {};
          if (err) {
            result.Message = "Error Occurred";
            result.Data = [];
            result.isSuccess = false;
          } else {
            if (record.length == 0) {
              result.Message = "Error Occurred";
              result.Data = [];
              result.isSuccess = false;
            } else {
              result.Message = "Status updated to block";
              result.Data = record;
              result.isSuccess = true;
            }
          }
          res.json(result);
        }
      );
    } else {
      record = await thoughtSchema.find({ Status: true });
      if (record.length < 1) {
        thoughtSchema.findByIdAndUpdate(
          req.body.id,
          { Status: true },
          (err, record) => {
            var result = {};
            if (err) {
              result.Message = "Error Occurred";
              result.Data = [];
              result.isSuccess = false;
            } else {
              if (record.length == 0) {
                result.Message = "Error Occurred";
                result.Data = [];
                result.isSuccess = false;
              } else {
                result.Message = "Status updated to unblock";
                result.Data = record;
                result.isSuccess = true;
              }
            }
            res.json(result);
          }
        );
      } else {
        var result = {};
        result.Message =
          "Status can't be updated as there is one thought which is unblock";
        result.Data = [];
        result.isSuccess = false;
        res.json(result);
      }
    }
  }
});

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

router.post("/memo", async (req, res) => {
  if (req.body.type == "singlememo") {
    memoSchema.find(
      {
        Eid: req.body.id,
        Date: {
          $gte: req.body.startdate,
          $lte: req.body.enddate,
        },
      },
      async (err, record) => {
        var result = {};
        if (err) {
          result.Message = "No Memo Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          if (record.length == 0) {
            result.Message = "No Memo Found";
            result.Data = [];
            result.isSuccess = false;
          } else {
            result.Message = "Memo Found";
            result.Data = record;
            result.isSuccess = true;
          }
        }
        res.json(result);
      }
    );
  } else if (req.body.type == "datememo") {
    record = await memoSchema
      .find({
        Eid: req.body.employee,
        Date: { $gte: req.body.startdate, $lte: req.body.enddate },
      })
      .populate({
        path: "Eid",
        select: "Name",
      });
    var result = {};
    if (record.length == 0) {
      result.Message = "No Memo Found";
      result.Data = [];
      result.isSuccess = false;
    } else {
      result.Message = "Memo Found";
      result.Data = record;
      result.isSuccess = true;
    }
    res.json(result);
  } else if (req.body.type == "getsinglememodetails") {
    record = await memoSchema
      .find({ _id: req.body.id })
      .populate("Eid", "Name");
    var result = {};
    if (record.length == 0) {
      result.Message = "No Memo Found";
      result.Data = [];
      result.isSuccess = false;
    } else {
      result.Message = "Memo Found";
      result.Data = record;
      result.isSuccess = true;
    }
    res.json(result);
  } else if (req.body.type == "requestmemo") {
    memoSchema.findByIdAndUpdate(
      req.body.id,
      {
        Reason: req.body.reason,
        ReasonSend: true,
        Status: "Waiting For Approval",
      },
      async (err, record) => {
        var result = {};
        if (err) {
          result.Message = "No Memo Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          if (record.length == 0) {
            result.Message = "No Memo Found";
            result.Data = [];
            result.isSuccess = false;
          } else {
            record = await memoSchema.findById(req.body.id);
            result.Message = "Memo Found";
            result.Data = record;
            result.isSuccess = true;
          }
        }
        res.json(result);
      }
    );
  } else if (req.body.type == "verifymemo") {
    memoSchema.findByIdAndUpdate(
      req.body.id,
      {
        Status: req.body.status,
      },
      (err, record) => {
        var result = {};
        if (err) {
          result.Message = "No Memo Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          if (record.length == 0) {
            result.Message = "No Memo Found";
            result.Data = [];
            result.isSuccess = false;
          } else {
            result.Message = "Memo Found";
            result.Data = record;
            result.isSuccess = true;
          }
        }
        res.json(result);
      }
    );
  }
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
        var worksheet = workbook.addWorksheet("My Sheet");
        worksheet.columns = [
          { header: "Employee Name", key: "Name", width: 32 },
          { header: "Date", key: "Date", width: 32 },
          { header: "Day", key: "Day", width: 15 },
          { header: "Status", key: "Status", width: 15 },
          { header: "In Time", key: "InTime", width: 15 },
          { header: "Out Time", key: "OutTime", width: 15 },
          {
            header: "Total Working Hour(In Seconds)",
            key: "DifferenceTime",
            width: 28,
          },
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
                  DifferenceTime: moment(
                    result[key][key1]["out"][i].Time,
                    "H:mm:ss"
                  ).diff(
                    moment(result[key][key1][key2][i].Time, "H:mm:ss"),
                    "seconds"
                  ),
                });
              }
            }
            i++;
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

router.post("/getotp", (req, res) => {
  var result = {};
  result.Message = "OPT";
  result.Data = 0;
  result.isSuccess = true;
  res.json(result);
});

module.exports = router;
