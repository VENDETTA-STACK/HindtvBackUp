/*Importing Modules */
var express = require("express");
var router = express.Router();
var masterLeaveLevelSchema = require("../models/masterLeaveLevel.model");
var adminSchema = require("../models/admin.model");
/*Importing Modules */

/* Function for curd operation master leave-reason*/
router.post("/", async(req, res) => {
    //Insert Reason Method
    if (req.body.type == "insert") {
        var permission = await checkpermission(req.body.type, req.body.token);
        if (permission.isSuccess == true) {
            var record = new masterLeaveLevelSchema({
                MasterName: req.body.name,
                MasterType: req.body.mastertype
            });
            record.save({}, function(err, record) {
                var result = {};
                if (err) {
                    result.Message = "Record Not Inserted";
                    result.Data = err;
                    result.isSuccess = false;
                } else if (record.length == 0) {
                    result.Message = "Record Not Inserted";
                    result.Data = [];
                    result.isSuccess = false;
                } else {
                    result.Message = "Record Inserted";
                    result.Data = record;
                    result.isSuccess = true;
                }
                res.json(result);
            });
        } else {
            res.json(permission);
        }
    }
    //Fetch all Reason from database
    /*else if (req.body.type == "getalldata") {
        var permission = await checkpermission(req.body.type, req.body.token);
        if (permission.isSuccess == true) {
            masterLeaveLevelSchema.find({}, (err, record) => {
                var result = {};
                if (err) {
                    result.Message = "Reasons Not Found";
                    result.Data = [];
                    result.isSuccess = false;
                } else {
                    if (record.length == 0) {
                        result.Message = "Reasons Not Found";
                        result.Data = [];
                        result.isSuccess = false;
                    } else {
                        result.Message = "Reasons Found.";
                        result.Data = record;
                        result.isSuccess = true;
                    }
                }
                res.json(result);
            });
        } else {
            res.json(permission);
        }
    }*/
    //Fetch all Reason from database for app
    else if (req.body.type == "getalldata") {
        masterLeaveLevelSchema.find({}, (err, record) => {
            var result = {};
            if (err) {
                result.Message = "Reasons Not Found";
                result.Data = [];
                result.isSuccess = false;
            } else {
                if (record.length == 0) {
                    result.Message = "Reasons Not Found";
                    result.Data = [];
                    result.isSuccess = false;
                } else {
                    result.Message = "Reasons Found.";
                    result.Data = record;
                    result.isSuccess = true;
                }
            }
            res.json(result);
        });

    }
    //updating status block and unblock
    else if (req.body.type == "statusupdate") {
        var permission = await checkpermission(req.body.type, req.body.token);
        if (permission.isSuccess == true) {
            if (req.body.sts == 'true') {
                masterLeaveLevelSchema.findByIdAndUpdate(
                    req.body.id, { Status: true },
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
                    });
            } else {
                masterLeaveLevelSchema.findByIdAndUpdate(
                    req.body.id, { Status: false },
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
                    });
            }
        }
    }
    //update method for update leave reason
    else if (req.body.type == "update") {
        var permission = await checkpermission(req.body.type, req.body.token);
        if (permission.isSuccess == true) {
            masterLeaveLevelSchema.findByIdAndUpdate(
                req.body.id, { MasterName: req.body.name },
                (err, record) => {
                    var result = {};
                    if (err) {
                        result.Message = "Name Not Updated";
                        result.Data = [];
                        result.isSuccess = false;
                    } else {
                        if (record.length == 0) {
                            result.Message = "Name Not Updated";
                            result.Data = [];
                            result.isSuccess = false;
                        } else {
                            result.Message = "Name Updated";
                            result.Data = record;
                            result.isSuccess = true;
                        }
                    }
                    res.json(result);
                });
        }
    }
    //get value single reason value
    else if (req.body.type == "getsingledata") {
        var permission = await checkpermission(req.body.type, req.body.token);
        if (permission.isSuccess == true) {
            masterLeaveLevelSchema.findById(
                req.body.id,
                (err, record) => {
                    var result = {};
                    if (err) {
                        result.Message = "Name Not Found";
                        result.Data = [];
                        result.isSuccess = false;
                    } else {
                        if (record == null || record.length == 0) {
                            result.Message = "Name Not Found";
                            result.Data = [];
                            result.isSuccess = false;
                        } else {
                            result.Message = "Name Found";
                            result.Data = record;
                            result.isSuccess = true;
                        }
                    }
                    res.json(result);
                });
        }
    }
  
  //get value single reason value
  else if (req.body.type == "getdata") {
    var permission = await checkpermission(req.body.type, req.body.token);
    if (permission.isSuccess == true) {
      masterLeaveLevelSchema.findById(req.body.id, (err, record) => {
        var result = {};
        if (err) {
          result.Message = "Name Not Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          if (record == null || record.length == 0) {
            result.Message = "Name Not Found";
            result.Data = [];
            result.isSuccess = false;
          } else {
            result.Message = "Name Found";
            result.Data = record;
            result.isSuccess = true;
          }
        }
        res.json(result);
      });
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

<<<<<<< HEAD
//updated 24.08
=======
//updated 24.08
>>>>>>> 469bdac9900f41cd50fe5fbc7952661a59ec108c
