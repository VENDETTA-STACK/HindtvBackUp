/*Importing Modules */
var express = require("express");
var router = express.Router();
var adminSchema = require("../models/admin.model");
const axios = require("axios");

/*Importing Modules */

router.post("/", async (req, res, next) => {
  if (req.body.type == "insert") {
    var name = req.body.name;
    var password = req.body.password;
    var mobile = req.body.mobile;
    var email = req.body.email;
    var result = {};
    var finddata = await adminSchema.find({ mobilenumber: mobile });
    if (finddata.length == 0) {
      var record = new adminSchema({
        name: name,
        password: password,
        mobilenumber: mobile,
        email: email,
      });
      var record = await record.save();
      if (record.length == 0) {
        result.Message = "Admin Not Inserted";
        result.Data = err;
        result.isSuccess = false;
      } else {
        result.Message = "Admin Inserted";
        result.Data = record;
        result.isSuccess = true;
      }
    } else {
      result.Message = "Mobile Number already exists.";
      result.Data = "MobileError";
      result.isSuccess = false;
    }
    res.json(result);
  } else if (req.body.type == "getdata") {
    var record = await adminSchema.find().select("name mobilenumber");
    var result = {};
    if (record.length == 0) {
      result.Message = "No Records Found.";
      result.Data = [];
      result.isSuccess = false;
    } else {
      result.Message = "Admin Found";
      result.Data = record;
      result.isSuccess = true;
    }
    res.json(result);
  } else if (req.body.type == "getadmin") {
    var record = await adminSchema.findById(req.body.id);
    var result = {};
    if (record.length == 0) {
      result.Message = "No Records Found.";
      result.Data = [];
      result.isSuccess = false;
    } else {
      result.Message = "Admin Found";
      result.Data = record;
      result.isSuccess = true;
    }
    res.json(result);
  } else if (req.body.type == "update") {
    var name = req.body.name;
    var password = req.body.password;
    var mobile = req.body.mobile;
    var email = req.body.email;
    var result = {};
    var finddata = await adminSchema.find(
      { _id: { $ne: req.body.id } },
      { mobilenumber: mobile }
    );
    if (finddata.length == 0) {
      var record = await adminSchema.findByIdAndUpdate(req.body.id, {
        name: name,
        password: password,
        mobilenumber: mobile,
        email: email,
      });
      var result = {};
      if (record.length == 0) {
        result.Message = "Admin Not Updated";
        result.Data = err;
        result.isSuccess = false;
      } else {
        result.Message = "Admin Updated";
        result.Data = record;
        result.isSuccess = true;
      }
    } else {
      result.Message = "Mobile Number already exists.";
      result.Data = "MobileError";
      result.isSuccess = false;
    }
    res.json(result);
  } else if (req.body.type == "login") {
    adminSchema.find(
      { mobilenumber: req.body.mobile, password: req.body.password },
      async (err, record) => {
        var result = {};
        if (err) {
          result.Message = err;
          result.Data = "error";
          result.isSuccess = false;
        } else {
          if (record.length == 0) {
            result.Message = "Incorrect Mobile or Password";
            result.Data = "invalidtext";
            result.isSuccess = false;
          } else {
            result.Message = "Admin Found";
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
