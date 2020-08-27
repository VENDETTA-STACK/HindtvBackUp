/*Importing Modules */
var express = require("express");
var router = express.Router();
var employeeSchema = require("../models/employee.model");
var subcompanySchema = require("../models/subcompany.models");
var adminSchema = require("../models/admin.model");
var timingSchema = require("../models/timing.models");
const multer = require("multer");

/*Importing Modules */

/*Post request for employee
  There are different type use for various activities
  type = insert : Insert a new employee,
  type = update : Update an individual employee
  type = getdata : Returns data of all employee
  type = gettiming : Returns data of all timing store for employee
  type = getsingledata : For editing fetches a single data of an user
  type = getsubcompanyemployee : Need to be shifted from it's call

  function checkpermission() : It checks whether you have a correct token to access data and also checks whether you have the rights to Add,View,Update the data.
*/

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

router.post("/", upload.fields([{ name: "employeeimage" }, {name: "employeedocument"}]), async function (req, res, next) {
 
  if (req.body.type == "insert") {
    var permission = await checkpermission(req.body.type, req.body.token);
    var employeecode = 'DL' + req.body.subcompany.substr(0,4)+ req.body.firstname.substr(0,4) + req.body.lastname.substr(0,4) + req.body.mobile.substr(0,4);
    if (permission.isSuccess == true) {
      console.log(req.body);
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
        WifiName: req.body.wifiname,
        WeekName: req.body.weekdayname,
        WeekDay: req.body.numofday,
        GpsTrack: req.body.gpstrack,
        AccountName:req.body.accountname,
        BankName:req.body.bankname,
        AccountNumber:req.body.accountnumber,
        IFSCCode:req.body.ifsccode,
        BranchName:req.body.branchname,
        MICRCode:req.body.micrcode,
        UPICode:req.body.upicode,
        ProfileImage: req.files.employeeimage[0].filename,
        CertificateImage: req.files.employeedocument[0].filename,
        EmployeeCode:employeecode,
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
    } else {
      res.json(permission);
    }
  } else if (req.body.type == "getdata") {
    var permission = await checkpermission(req.body.type, req.body.token);
    if (permission.isSuccess == true) {
      var companyselection = await adminSchema.findById(req.body.token);
      if (companyselection.allaccessubcompany == true) {
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
      } else {
        var record = await employeeSchema
          .find({ SubCompany: companyselection.accessCompany })
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
      }
    } else {
      res.json(permission);
    }
  } else if (req.body.type == "getsingledata") {
    var permission = await checkpermission(req.body.type, req.body.token);
    if (permission.isSuccess == true) {
        var record = await employeeSchema
        .findById(req.body.id,(err,record)=>{
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
        });
    } else {
      res.json(permission);
    }

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
    var permission = await checkpermission(req.body.type, req.body.token);
    if (permission.isSuccess == true) {
      var record = await employeeSchema.findById(req.body.id);
      var result = {};
      if (record !== null && record.length == 0) {
        result.Message = "Employee Not Found";
        result.Data = [];
        result.isSuccess = false;
      } else {
        result.Message = "Employee Found";
        result.Data = record;
        result.isSuccess = true;
      }
      res.json(result);
    } else {
      res.json(permission);
    }
  } else if (req.body.type == "update") {
   
    var permission = await checkpermission(req.body.type, req.body.token);
   
    console.log(employeecode);
    if (permission.isSuccess == true) {
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
          WifiName: req.body.wifiname,
          WeekName: req.body.weekdayname,
          WeekDay: req.body.numofday,

          GpsTrack: req.body.gpstrack,
          AccountName:req.body.accountname,
          BankName:req.body.bankname,
          AccountNumber:req.body.accountnumber,
          IFSCCode:req.body.ifsccode,
          BranchName:req.body.branchname,
          MICRCode:req.body.micrcode,
          UPICode:req.body.upicode,
          ProfileImage: req.files.employeeimage[0].filename,
        CertificateImage: req.files.employeedocument[0].filename,
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
    } else {
      res.json(permission);
    }
  } else if (req.body.type == "gettiming") {
    var record = await timingSchema.find();
    var result = {};
    if (record.length == 0) {
      result.Message = "Employee Not Updated";
      result.Data = [];
      result.isSuccess = false;
    } else {
      result.Message = "Employee Updated";
      result.Data = record;
      result.isSuccess = true;
    }
    res.json(result);
  }
});

async function checkpermission(type, token) {
  var result = {};
  if (token != undefined) {
    var admindetails;
    if (type == "insert") {
      admindetails = await adminSchema.find({ _id: token, "Employee.A": 1 });
    } else if (type == "getdata") {
      admindetails = await adminSchema.find({ _id: token, "Employee.V": 1 });
    } else if (type == "getemployee" || type == "update" || type == "getsingledata") {
      admindetails = await adminSchema.find({ _id: token, "Employee.U": 1 });
    }

    if (admindetails.length != 0) {
      result.Message = "";
      result.Data = [];
      result.isSuccess = true;
    } else {
      result.Message = "You don't have access.";
      result.Data = [];
      result.isSuccess = false;
    }
  } else {
    result.Message = "You don't have a valid token.";
    result.Data = [];
    result.isSuccess = false;
  }
  return result;
}

module.exports = router;
