/*Importing Modules */
var express = require("express");
const { find } = require("../models/leave.model");
var router = express.Router();
var leaveSchema = require("../models/leave.model");
var adminSchema = require("../models/admin.model");
    /*Importing Modules */

router.post("/", async(req, res) => {
    //Insert data in Leave Collection    
    
    if (req.body.type == "insert") {
        var permission = await checkpermission(req.body.type, req.body.token);
        if(permission.isSuccess == true){
            var date = new Date();
            date = date.toISOString().split("T")[0];
            console.log(data);
            var record = new leaveSchema({
                EmployeeId: req.body.EmployeeId,
                SubCompany: req.body.SubCompanyId,
                Company: req.body.CompanyId,
                Reason: req.body.ReasonId,
                ApplyDate : date,
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
    }
    else if(req.body.type=="getdata"){
        var permission = await checkpermission(req.body.type, req.body.token);
        if(permission.isSuccess == true){
            var companyselection = await adminSchema.findById(req.body.token);
            if (companyselection.allaccessubcompany == true) {
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
                }).sort({"ApplyDate":-1});
                var result = {};
                if(record.length == 0){
                    result.Message = "Leave Data is not found.";
                    result.Data = [];
                    result.isSuccess = false;
                    res.json(result);
                } else{
                    result.Message = "Leave Data is found.";
                    result.Data = record;
                    result.isSuccess = true;
                    res.json(result);
                }
            }else{
                var record = await leaveSchema.find({ SubCompany: companyselection.accessCompany }).populate({
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
                }).sort({"ApplyDate":-1});
                var result = {};
                if(record.length == 0){
                    result.Message = "Leave Data is not found.";
                    result.Data = [];
                    result.isSuccess = false;
                    res.json(result);
                } else{
                    result.Message = "Leave Data is found.";
                    result.Data = record;
                    result.isSuccess = true;
                    res.json(result);
                }
            
        }
    }
        
    }
    else if(req.body.type=="update"){
        var permission = await checkpermission(req.body.type, req.body.token);
        if(permission.isSuccess == true){
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
    }
    else if(req.body.type == "getsingledata"){
        var permission = await checkpermission(req.body.type, req.body.token);
        if(permission.isSuccess == true){
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
    }
});



async function checkpermission(type, token) {
    var result = {};
    if (token != undefined) {
        var admindetails;
        if (type == "insert") {
            admindetails = await adminSchema.find({ _id: token, "Thought.A": 1 });
        } else if (type == "getdata") {
            admindetails = await adminSchema.find({ _id: token, "Thought.V": 1 });
        } else if (
            type == "getsingledata" ||
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
//Updated 26.08 by dhanpal