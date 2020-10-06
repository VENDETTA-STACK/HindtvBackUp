/*Importing Modules */
var express = require("express");
const { find } = require("../models/leave.model");
var router = express.Router();
var leaveSchema = require("../models/leave.model")
    /*Importing Modules */

router.post("/", async(req, res) => {
    //Insert data in Leave Collection    
    if (req.body.type == "insert") {
        var record = new leaveSchema({
            EmployeeId: req.body.EmployeeId,
            SubCompany: req.body.SubCompanyId,
            Company: req.body.CompanyId,
            Reason: req.body.ReasonId,
            ApplyDate : Date.now(),
            StartDate : req.body.startdate,
            EndDate : req.body.enddate,
            LeaveType : req.body.leavetype,
            LeavePeriod : req.body.leaveperiod,
            Description: req.body.description,
            LeaveStatus:"Pending",
        });
        record.save({}, function(err, record) {
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
    }
    else if(req.body.type=="getdata"){
        var record = await leaveSchema.find().populate({
            path:"EmployeeId",
            select:"Name"
        }).populate({
            path:"SubCompany",
            select:"Name"
        }).populate({
            path:"Company",
            select:"Name"
            
        }).populate({
            path:"Reason",
            select:"MasterName"
        });
        var result = {};
        if(record.length == 0){
            result.Message = "Leave Data is not found.";
            result.Data = [];
            result.isSuccess = false;
            res.json(result);
        }
        else{
            result.Message = "Leave Data is found.";
            result.Data = record;
            result.isSuccess = true;
            res.json(result);
        }
    }
    else if(req.body.type=="update"){
        var data = await leaveSchema.find({_id:req.body.id});
        console.log(data);
        leaveSchema.findByIdAndUpdate(req.body.id,{
            LeaveStatus:req.body.status
        },function(err,record){
            var result = {};
            if(err){
                result.Message = "Leave Data is not found.";
                result.Data = [];
                result.isSuccess = false;
            }  else {
                if(record.length == 0){
                    result.Message = "Leave Data is not found.";
                    result.Data = [];
                    result.isSuccess = false;
                } else {
                    result.Message = "Leave Data is found.";
                    result.Data = record;
                    result.isSuccess = true;
                }
            }
            console.log(record);
            res.json(result);
        });
    }
    else if(req.body.type == "getsingledata"){
        var record = await leaveSchema.find({_id:req.body.id}).populate({
            path:"EmployeeId",
            select:"Name"
        }).populate({
            path:"SubCompany",
            select:"Name"
        }).populate({
            path:"Company",
            select:"Name"
            
        }).populate({
            path:"Reason",
            select:"MasterName"
        });
        var result = {};
        if(record.length == 0){
            result.Message = "Leave Data is not found.";
            result.Data = [];
            result.isSuccess = false;
        }
        else{
            result.Message = "Leave Data is found.";
            result.Data = record;
            result.isSuccess = true;
        }
        res.json(result);
    }
});

module.exports = router;
//Updated 26.08 by dhanpal