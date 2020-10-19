/*Importing Modules */
var express = require("express");
var router = express.Router();
var memoSchema = require("../models/memo.model");
var adminSchema = require("../models/admin.model");
const mongoose = require("mongoose");
const { populate } = require("../models/memo.model");
/*Importing Modules */

/* Post request for memo
  type = singlememo : Get data of an indivaidual employee memo,works on mobile platform
  type = requestmemo : A employee sends a reason for his/her mobile to request to terminate that particular memo(Mobile)
  type = datememo : Get data of  memo between specific date, works on admin panel.
  type = getsinglememodetails : Admin panel specific memo of an employee to find out the reason
  type = verifymemo : Admin panel specific, verifying the memo from admin panel
*/
router.post("/", async (req, res) => {
  if (req.body.type == "singlememo") {
    memoSchema.find(
      {
        Eid: req.body.id,
        Date: {
          $gte: req.body.startdate,
          $lte: req.body.enddate,
        },
      },
      async (err, record) => {
        var result = {};
        if (err) {
          result.Message = "No Memo Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          if (record.length == 0) {
            result.Message = "No Memo Found";
            result.Data = [];
            result.isSuccess = false;
          } else {
            result.Message = "Memo Found";
            result.Data = record;
            result.isSuccess = true;
          }
        }
        res.json(result);
      }
    );
  } else if (req.body.type == "datememo") {
    var permission = await checkpermission(req.body.type, req.body.token);
    if (permission.isSuccess == true) {
      record = await memoSchema
        .find({
          Eid: mongoose.Types.ObjectId(req.body.employee),
          Date: { $gte: req.body.startdate, $lte: req.body.enddate },
        })
        .populate({
          path: "Eid",
          select: "Name",
        });
      var result = {};
      if (record.length == 0) {
        result.Message = "No Memo Found";
        result.Data = [];
        result.isSuccess = false;
      } else {
        result.Message = "Memo Found";
        result.Data = record;
        result.isSuccess = true;
      }
      res.json(result);
    } else {
      res.json(permission);
    }
  } else if (req.body.type == "getsinglememodetails") {
    var permission = await checkpermission(req.body.type, req.body.token);
    if (permission.isSuccess == true) {
      record = await memoSchema
        .find({ _id: req.body.id })
        .populate("Eid", "Name");
      var result = {};
      if (record.length == 0) {
        result.Message = "No Memo Found";
        result.Data = [];
        result.isSuccess = false;
      } else {
        result.Message = "Memo Found";
        result.Data = record;
        result.isSuccess = true;
      }
      res.json(result);
    } else {
      res.json(permission);
    }
  } else if (req.body.type == "requestmemo") {
    memoSchema.findByIdAndUpdate(
      req.body.id,
      {
        Reason: req.body.reason,
        ReasonSend: true,
        Status: "Waiting For Approval",
      },
      async (err, record) => {
        var result = {};
        if (err) {
          result.Message = "No Memo Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          if (record.length == 0) {
            result.Message = "No Memo Found";
            result.Data = [];
            result.isSuccess = false;
          } else {
            record = await memoSchema.findById(req.body.id);
            result.Message = "Memo Found";
            result.Data = record;
            result.isSuccess = true;
          }
        }
        res.json(result);
      }
    );
  } else if (req.body.type == "verifymemo") {
    var permission = await checkpermission(req.body.type, req.body.token);
    if (permission.isSuccess == true) {
      memoSchema.findByIdAndUpdate(
        req.body.id,
        {
          Status: req.body.status,
        },
        (err, record) => {
          var result = {};
          if (err) {
            result.Message = "No Memo Found";
            result.Data = [];
            result.isSuccess = false;
          } else {
            if (record.length == 0) {
              result.Message = "No Memo Found";
              result.Data = [];
              result.isSuccess = false;
            } else {
              result.Message = "Memo Found";
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
  } else if (req.body.type == "getalldata"){
    var permission = await checkpermission(req.body.type, req.body.token);
    if (permission.isSuccess == true) {
      var companyselection = await adminSchema.findById(req.body.token);
      if (companyselection.allaccessubcompany == true) {
        var record = await memoSchema.find().populate({
          path:"Eid",
          populate:{
            path:"SubCompany"
          }
        });
        var result =  {};
        if(record.length == 0){
          result.Message = "Record not found.";
          result.Data = [];
          result.isSuccess = false;
        } else{
          result.Message = "Record found.";
          result.Data = record;
          result.isSuccess = true;
        }
        res.json(result);
      } else{
        var record = await memoSchema.aggregate([
          {
            $match:{
              
            }
          },
          {
            $lookup:{
                from: "employees",
                localField: "Eid",
                foreignField: "_id",
                as: "EmployeeId"
            }
          },
          { "$unwind": "$EmployeeId" },
          {
            $lookup:{
                from: "subcompany",
                localField: "SubCompany",
                foreignField: "_id",
                as: "SubCompanyId"
            }
          },
          { "$unwind": "$SubCompanyId" },
          {
              $match :{
                  "EmployeeId.SubCompany":mongoose.Types.ObjectId(companyselection.accessCompany),
              }
          }
        ]);
        var result = {};
        if(record.length == 0){
          result.Message = "Record not found.";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "Record found.";
          result.Data = record;
          result.isSuccess = true;
        }
        res.json(result);
      }
    } 
  } else if (req.body.type == "getmemodata"){
    var record = await memoSchema.find({_id:req.body.id}).populate({
      path:"Eid",
      populate:{
        path:"SubCompany"
      }
    });
    var result = {};
    if(record.length == 0){
      result.Message = "Record not found.";
      result.Data = [];
      result.isSuccess = false;
    }else{
      result.Message = "Record found.";
      result.Data = record;
      result.isSuccess = true;
    }
    res.json(result);
  } else if (req.body.type == "updatedata"){
    console.log(req.body);
    memoSchema.findByIdAndUpdate(req.body.id,{Status:req.body.status},(err,record)=>{
      var result = {};
      if(err){
        result.Message = "Record not update.";
        result.Data = [];
        result.isSuccess = false;
      } else {
        if(record.length == 0){
          result.Message = "Record not update.";
          result.Data = [];
          result.isSuccess = false;
        } else{
          result.Message = "Record update.";
          result.Data = record;
          result.isSuccess = true;
        }
        console.log(record);
      }
      res.json(result);
    })
  }
});

async function checkpermission(type, token) {
  var result = {};
  if (token != undefined) {
    var admindetails;
    if (type == "insert") {
      admindetails = await adminSchema.find({ _id: token, "Memo.A": 1 });
    } else if (type == "datememo" || type == "getsinglememodetails" || type == "getalldata") {
      admindetails = await adminSchema.find({ _id: token, "Memo.V": 1 });
    } else if (type == "verifymemo") {
      admindetails = await adminSchema.find({ _id: token, "Memo.U": 1 });
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
