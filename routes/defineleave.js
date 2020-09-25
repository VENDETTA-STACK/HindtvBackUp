/* Import Module */
var express = require("express");
var router = express.Router();
var defineleaveSchema = require("../models/defineleave.model");
var adminSchema = require("../models/admin.model");

/** Import Module */


router.post("/",async function(req,res){
    if(req.body.type == "insert"){
        var permission = await checkpermission(req.body.type, req.body.token);
        if(permission.isSuccess == true){
            var record = new defineleaveSchema({
                StartDate : req.body.startdate,
                EndDate : req.body.enddate,
                Year:req.body.year,
                SubCompanyId : req.body.subcompanyId,
                LeaveNumber : req.body.leave,
            });
            record.save({}, function(err,record){
                var result = {};
                if (err) {
                    result.Message = "Record Not Inserted";
                    result.Data = err;
                    result.isSuccess = false;
                } else {
                    if (record.length == 0 || record.length == null) {
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
        }
        else{
            res.json(permission);
        }
    }
    else if(req.body.type == "update"){
        //var permission = await checkpermission(req.body.type, req.body.token);
        // if(permission.isSuccess == true){
             defineleaveSchema.findByIdAndUpdate(req.body.id,{
                StartDate : req.body.startdate,
                EndDate : req.body.enddate,
                SubCompanyId : req.body.subcompanyId,
                Leave : req.body.leave,
                Year: req.body.year,
                LeaveNumber : req.body.leave
               
            },function(err,record){
                var result = {};
                if (err) {
                    result.Message = "Record Not Updated";
                    result.Data = err;
                    result.isSuccess = false;
                } else {
                    if (record.length == 0 || record.length == null) {
                        result.Message = "Record Not Updated";
                        result.Data = [];
                        result.isSuccess = false;
                    } else {
                        result.Message = "Record Updated";
                        result.Data = record;
                        result.isSuccess = true;
                    }
                }
                res.json(result);
            });
        // } else {
        //     res.json(permission);
        // }       
    }
    else if(req.body.type == "getdata"){
        var permission = await checkpermission(req.body.type, req.body.token);
        if(permission.isSuccess == true){
            var record = await defineleaveSchema.find({Year:req.body.year});
            console.log(record);
            var result = {};
            if(record.length == 0){
                result.Message = "Record Not Found.";
                result.Data = [];
                result.isSuccess = false;
            }
            else{
                result.Message = "Record Found.";
                result.Data = record;
                result.isSuccess = true;
            }
            res.json(result);
        } else {
            res.json(permission);
        }  
    }

    else if(req.body.type == "getsingledata"){

        var record = await defineleaveSchema.findById(req.body.id);
        console.log(record);
            var result = {};
            
            if (record.length == 0) {
                result.Message = "Record Not Found.";
                result.Data = [];
                result.isSuccess = false;
            } else {
                result.Message = "Record Found.";
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
      if (type == "insert" || type == "update") {
        admindetails = await adminSchema.find({ _id: token, "Employee.A": 1 });
      } else if (type == "getdata") {
        admindetails = await adminSchema.find({ _id: token, "Employee.V": 1 });
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
