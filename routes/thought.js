/*Importing Modules */
var express = require("express");
var router = express.Router();
var thoughtSchema = require("../models/thoughts.model");
var adminSchema = require("../models/admin.model");
/*Importing Modules */

/* Post request for thought
  type = insert :
  type = getalldata :
  type = getsingledata :
  type = getdata :
  type = update :
  type = statusupdate :
*/

router.post("/", async (req, res) => {
  if (req.body.type == "insert") {
    var permission = await checkpermission(req.body.type, req.body.token);
    if (permission.isSuccess == true) {
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
    } else {
      res.json(permission);
    }
  } else if (req.body.type == "getalldata") {
    var permission = await checkpermission(req.body.type, req.body.token);
    if (permission.isSuccess == true) {
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
    } else {
      res.json(permission);
    }
  } else if (req.body.type == "getsingledata") {
    /*This is for mobile api so no permission validation is required*/
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
    var permission = await checkpermission(req.body.type, req.body.token);
    if (permission.isSuccess == true) {
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
    } else {
      res.json(permission);
    }
  } else if (req.body.type == "update") {
    var permission = await checkpermission(req.body.type, req.body.token);
    if (permission.isSuccess == true) {
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
    } else {
      res.json(permission);
    }
  } else if (req.body.type == "statusupdate") {
    var permission = await checkpermission(req.body.type, req.body.token);
    if (permission.isSuccess == true) {
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
            "Status can't be updated as there is one thought which is active.";
          result.Data = [];
          result.isSuccess = false;
          res.json(result);
        }
      }
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
      admindetails = await adminSchema.find({ _id: token, "Thought.A": 1 });
    } else if (type == "getalldata") {
      admindetails = await adminSchema.find({ _id: token, "Thought.V": 1 });
    } else if (
      type == "getdata" ||
      type == "update" ||
      type == "statusupdate"
    ) {
      admindetails = await adminSchema.find({ _id: token, "Thought.U": 1 });
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
