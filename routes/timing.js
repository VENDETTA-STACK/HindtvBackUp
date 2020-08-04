var express = require("express");
var router = express.Router();
var timingSchema = require("../models/timing.models");

router.post("/", async (req, res) => {
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

module.exports = router;
