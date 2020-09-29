var express = require("express");
var router = express.Router();
var subcompanySchema = require("../models/subcompany.models");
var companySchema = require("../models/company.models");
var adminSchema = require("../models/admin.model");

router.post("/", async function (req, res, next) {
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
      MemoNumber: req.body.memonumber,
      SalaryDate: req.body.salarydate,
      LocationId: req.body.location,
    });
    record.save({}, function (err, record) {
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
    var companyselection = await adminSchema.findById(req.body.token);
    if (companyselection.allaccessubcompany == true) {
      console.log(req.body);
      if(req.body.subcompanyID == undefined){
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
            result.Message = "SubCompany Found";
            result.Data = record;
            result.isSuccess = true;
          }
          res.json(result);
        });
      }
      else if(req.body.subcompanyID != undefined){
        subcompanySchema
        .findById(req.body.subcompanyID)
        .populate("CompanyId")
        .then((record) => {
          var result = {};
          if (record.length == 0) {
            result.Message = "SubCompany Not Found";
            result.Data = [];
            result.isSuccess = false;
          } else {
            result.Message = "SubCompany Found";
            result.Data = record;
            result.isSuccess = true;
          }
          res.json(result);
        });
      }
    } else {
      subcompanySchema
        .find({ _id: companyselection.accessCompany })
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
    }
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
    var companyselection = await adminSchema.findById(req.body.token);
    if (companyselection.allaccessubcompany == true) {
      subcompanySchema.find(
        { CompanyId: req.body.CompanyId },
        (err, record) => {
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
        }
      );
    } else {
      subcompanySchema.find(
        { _id: companyselection.accessCompany, CompanyId: req.body.CompanyId },
        (err, record) => {
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
        }
      );
    }
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
    req.body.buffertime =
      req.body.buffertime == undefined ? 0 : req.body.buffertime;
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
        MemoNumber: req.body.memonumber,
        SalaryDate: req.body.salarydate,
        LocationId: req.body.location,
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

module.exports = router;
