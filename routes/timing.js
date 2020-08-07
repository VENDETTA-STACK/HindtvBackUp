/*Importing Modules */
var express = require("express");
var router = express.Router();
var timingSchema = require("../models/timing.models");
var adminSchema = require("../models/admin.model");
/*Importing Modules */

/* Post request for timing
  type = insert : To insert new timing
  type = getdata : To display all timing
  type = getsingletimedata : To get an individual time for edit
  type = update :  To update an existing timing
*/

router.post("/", async (req, res) => {
  if (req.body.type == "insert") {
    var permission = await checkpermission(req.body.type, req.body.token);
    if (permission.isSuccess == true) {
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
    } else {
      res.json(permission);
    }
  } else if (req.body.type == "getdata") {
    var permission = await checkpermission(req.body.type, req.body.token);
    if (permission.isSuccess == true) {
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
    } else {
      res.json(permission);
    }
  } else if (req.body.type == "getsingletimedata") {
    var permission = await checkpermission(req.body.type, req.body.token);
    if (permission.isSuccess == true) {
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
    } else {
      res.json(permission);
    }
  } else if (req.body.type == "update") {
    var permission = await checkpermission(req.body.type, req.body.token);
    if (permission.isSuccess == true) {
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
    } else {
      res.json(permission);
    }
  }
});

async function checkpermission(type, token) {
  var result = {};
  if (token != undefined) {
    var admindetails;
    if (type == "insert") {
      admindetails = await adminSchema.find({ _id: token, "Timing.A": 1 });
    } else if (type == "getdata") {
      admindetails = await adminSchema.find({ _id: token, "Timing.V": 1 });
    } else if (type == "getsingletimedata" || type == "update") {
      admindetails = await adminSchema.find({ _id: token, "Timing.U": 1 });
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
