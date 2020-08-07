/*Importing Modules */
var express = require("express");
var router = express.Router();
var adminSchema = require("../models/admin.model");
/*Importing Modules */

router.post("/", async (req, res, next) => {
  if (req.body.type == "insert") {
    permission = await checkpermission(req.body.type, req.body.token);
    if (permission.isSuccess == true) {
      var name = req.body.name;
      var password = req.body.password;
      var mobile = req.body.mobile;
      var email = req.body.email;
      var accessCompany = req.body.subcompany;
      var allaccessubcompany = accessCompany == "0" ? true : false;
      var rights = JSON.parse(req.body.rights);
      var result = {};
      var finddata = await adminSchema.find({ mobilenumber: mobile });
      if (finddata.length == 0) {
        if (accessCompany == 0) {
          var record = new adminSchema({
            name: name,
            password: password,
            mobilenumber: mobile,
            email: email,
            allaccessubcompany: allaccessubcompany,
            Admin: rights[0],
            Timing: rights[1],
            Thought: rights[2],
            SubCompany: rights[3],
            Employee: rights[4],
            Attendance: rights[5],
            Memo: rights[6],
            Report: rights[7],
          });
        } else {
          var record = new adminSchema({
            name: name,
            password: password,
            mobilenumber: mobile,
            email: email,
            allaccessubcompany: allaccessubcompany,
            accessCompany: accessCompany,
            Admin: rights[0],
            Timing: rights[1],
            Thought: rights[2],
            SubCompany: rights[3],
            Employee: rights[4],
            Attendance: rights[5],
            Memo: rights[6],
            Report: rights[7],
          });
        }
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
    } else {
      res.json(permission);
    }
  } else if (req.body.type == "getdata") {
    permission = await checkpermission(req.body.type, req.body.token);
    if (permission.isSuccess == true) {
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
    } else {
      res.json(permission);
    }
  } else if (req.body.type == "getadmin") {
    var permission = await checkpermission(req.body.type, req.body.token);
    if (permission.isSuccess == true) {
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
    } else {
      res.json(permission);
    }
  } else if (req.body.type == "update") {
    permission = await checkpermission(req.body.type, req.body.token);
    if (permission.isSuccess == true) {
      var name = req.body.name;
      var password = req.body.password;
      var mobile = req.body.mobile;
      var email = req.body.email;
      var accessCompany = req.body.subcompany;
      var allaccessubcompany = accessCompany == "0" ? true : false;
      var rights = JSON.parse(req.body.rights);
      var result = {};
      var finddata = await adminSchema.find(
        { _id: { $ne: req.body.id } },
        { mobilenumber: mobile }
      );
      if (finddata.length == 0) {
        if (accessCompany == 0) {
          var record = await adminSchema.findByIdAndUpdate(req.body.id, {
            name: name,
            password: password,
            mobilenumber: mobile,
            email: email,
            allaccessubcompany: allaccessubcompany,
            Admin: rights[0],
            Timing: rights[1],
            Thought: rights[2],
            SubCompany: rights[3],
            Employee: rights[4],
            Attendance: rights[5],
            Memo: rights[6],
            Report: rights[7],
          });
        } else {
          var record = await adminSchema.findByIdAndUpdate(req.body.id, {
            name: name,
            password: password,
            mobilenumber: mobile,
            email: email,
            allaccessubcompany: allaccessubcompany,
            accessCompany: accessCompany,
            Admin: rights[0],
            Timing: rights[1],
            Thought: rights[2],
            SubCompany: rights[3],
            Employee: rights[4],
            Attendance: rights[5],
            Memo: rights[6],
            Report: rights[7],
          });
        }
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
    } else {
      res.json(permission);
    }
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
            result.Data = [];
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

async function checkpermission(type, token) {
  var result = {};
  if (token != undefined) {
    var admindetails;
    if (type == "insert") {
      admindetails = await adminSchema.find({ _id: token, "Admin.A": 1 });
    } else if (type == "getdata") {
      admindetails = await adminSchema.find({ _id: token, "Admin.V": 1 });
    } else if (type == "getadmin" || type == "update") {
      admindetails = await adminSchema.find({ _id: token, "Admin.U": 1 });
    } else {
      //
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
