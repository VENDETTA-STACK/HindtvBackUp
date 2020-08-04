/*Importing Modules */
var express = require("express");
var router = express.Router();
var memoSchema = require("../models/memo.model");
/*Importing Modules */

/* Post request for memo
  type = singlememo : Get data of an indivaidual memo
  type = datememo : Get data of  memo between specific date.
  type = getsinglememodetails : Admin panel specific memo of an employee to find out the reason
  type = verifymemo : Verifying the memo from admin panel
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
    record = await memoSchema
      .find({
        Eid: req.body.employee,
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
  } else if (req.body.type == "getsinglememodetails") {
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
  }
});

module.exports = router;
