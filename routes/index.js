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
const { stat } = require("fs");
var attendImg = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/uploads");
  },
  filename: function (req, file, cb) {
    console.log(file);
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
    var record = new subcompanySchema({
      Name: req.body.name,
      Address: req.body.address,
      ContactPersonName: req.body.contactpersonname,
      ContactPersonNumber: req.body.contactpersonnumber,
      Email: req.body.email,
      GSTIN: req.body.gstin,
      Status: "Active",
      CompanyId: req.body.companyid,
      lat: req.body.lat,
      long: req.body.long,
      Link: req.body.googlelink,
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
    subcompanySchema.findByIdAndUpdate(
      req.body.id,
      {
        Name: req.body.name,
        Address: req.body.address,
        ContactPersonName: req.body.contactpersonname,
        ContactPersonNumber: req.body.contactpersonnumber,
        Email: req.body.email,
        GSTIN: req.body.gstin,
        Status: "Active",
        CompanyId: req.body.companyid,
        lat: req.body.lat,
        long: req.body.long,
        Link: req.body.googlelink,
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

function calculatedistance(plon1, plon2, plat1, plat2) {
  lon1 = plon1;
  lon2 = plon2;
  lat1 = plat1;
  lat2 = plat2;
  var radlat1 = (Math.PI * lat1) / 180;
  var radlat2 = (Math.PI * lat2) / 180;
  var theta = lon1 - lon2;
  var radtheta = (Math.PI * theta) / 180;
  var dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344;
  return dist;
}

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

router.post("/attendance", upload.single("attendance"), async function (
  req,
  res,
  next
) {
  period = getdate();
  if (req.body.type == "in") {
    console.log(req.body);
    var longlat = await employeeSchema
      .find({ _id: req.body.employeeid })
      .populate("SubCompany");
    dist = calculatedistance(
      req.body.longitude,
      longlat[0]["SubCompany"].lat,
      req.body.latitude,
      longlat[0]["SubCompany"].long
    );
    var NAME = longlat[0]["SubCompany"].Name;
    var fd = dist * 1000;
    var area =
      fd > 100
        ? "http://www.google.com/maps/place/" +
          req.body.latitude +
          "," +
          req.body.longitude
        : NAME;
    var record = attendeanceSchema({
      EmployeeId: req.body.employeeid,
      Status: req.body.type,
      Date: period.date,
      Time: period.time,
      Day: period.day,
      Image: req.file.filename,
      Area: area,
    });
    record.save({}, function (err, record) {
      var result = {};
      if (err) {
        result.Message = "Attendance Not Marked";
        result.Data = [];
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
  } else if (req.body.type == "out") {
    var longlat = await employeeSchema
      .find({ _id: req.body.employeeid })
      .populate("SubCompany");
    dist = calculatedistance(
      req.body.longitude,
      longlat[0]["SubCompany"].lat,
      req.body.latitude,
      longlat[0]["SubCompany"].long
    );
    var NAME = longlat[0]["SubCompany"].Name;
    var fd = dist * 1000;
    var area =
      fd > 100
        ? "http://www.google.com/maps/place/" +
          req.body.latitude +
          "," +
          req.body.longitude
        : NAME;
    var record = attendeanceSchema({
      EmployeeId: req.body.employeeid,
      Status: req.body.type,
      Date: period.date,
      Time: period.time,
      Day: period.day,
      Image: req.file.filename,
      Area: area,
    });
    record.save({}, function (err, record) {
      var result = {};
      if (err) {
        result.Message = "Attendance Not Marked";
        result.Data = [];
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
  var dbRef = firebase.database().ref("Database");
  const data = await dbRef.once("value", function (snapshot) {
    return snapshot.val();
  });
  res.json(data);
});

router.post("/timing", (req, res) => {
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

router.post("/testing", async (req, res) => {
  long = 21.141069;
  lat = 72.803673;
  console.log("http://www.google.com/maps/place/" + long + "," + lat);
});
module.exports = router;
