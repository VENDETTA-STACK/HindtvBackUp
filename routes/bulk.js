/*Importing Module*/
var express = require("express");
var router = express.Router();
const multer = require("multer");
var employeeSchema = require("../models/employee.model");
var subcomanySchema = require("../models/subcompany.models");
var timingSchema = require("../models/timing.models");
var adminSchema = require("../models/admin.model");
var Excel = require("exceljs");
const mongoose = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");
/*Importing Module*/

/*Bulk Upload Router with different access 
    @Type = employee - It brings all the data of employee and store it in excel, also it brings data from subcomapny and timing for making list validation in SubCompany and Timing.
*/

var report = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "bulk/Upload");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        file.originalname.split(".")[1]
    );
  },
});

var upload = multer({ storage: report });

const unlinkAsync = promisify(fs.unlink);

router.post("/", upload.single("report"), async (req, res) => {
  if (req.body.type == "employee") {
    var permission = await checkpermission(req.body.type, req.body.token);
    if (permission.isSuccess == true) {
      var data = await employeeSchema
        .find({})
        .populate({ path: "SubCompany", select: "Name" })
        .populate({ path: "Timing" });
      try {
        var workbook = new Excel.Workbook();
        var worksheet = workbook.addWorksheet("Tutorial");
        var worksheet1 = workbook.addWorksheet("Employee-Data");
        var worksheet2 = workbook.addWorksheet("SubCompany");
        var worksheet3 = workbook.addWorksheet("Timing");
        worksheet.columns = [
          { header: "Tutorial", key: "Tutorial", width: 500 },
        ];
        worksheet1.columns = [
          { header: "EmployeeKey", key: "Key", width: 32 },
          { header: "Name", key: "Name", width: 32 },
          { header: "First Name", key: "FName", width: 32 },
          { header: "Middle Name", key: "MName", width: 32 },
          { header: "Last Name", key: "LName", width: 32 },
          { header: "SubCompany", key: "SubCompany", width: 32 },
          { header: "Timing", key: "Timing", width: 32 },
          { header: "Gender", key: "Gender", width: 32 },
          { header: "DOB", key: "DOB", width: 32 },
          { header: "Maritial Status", key: "MarritialStatus", width: 32 },
          { header: "Mobile", key: "Mobile", width: 32 },
          { header: "Mail", key: "Mail", width: 32 },
          { header: "JoinDate", key: "JoinDate", width: 32 },
          { header: "ConfirmationDate", key: "ConfirmationDate", width: 32 },
          { header: "TerminationDate", key: "TerminationDate", width: 32 },
          { header: "Prohibition", key: "Prohibition", width: 32 },
          { header: "IDtype", key: "IDtype", width: 32 },
          { header: "IDnumber", key: "IDnumber", width: 32 },
          { header: "Department", key: "Department", width: 32 },
          { header: "Designation", key: "Designation", width: 32 },
        ];
        worksheet.addRow({
          Tutorial: "1. : This is the bulk upload for employee data.",
        });
        worksheet.addRow({
          Tutorial:
            "2: Here you can edit each employee whom you have been given access.",
        });
        worksheet.addRow({
          Tutorial:
            "3: There will be a employee-data worksheet where all editing will take place.",
        });
        worksheet.addRow({
          Tutorial:
            "4: Once you complete your editing please go back to the page from where you downloaded it and you will find a upload excel file.",
        });
        worksheet.addRow({
          Tutorial:
            "5: There additional worksheet, SubCompany and Timing please donot make any changes on it.",
        });
        worksheet.addRow({
          Tutorial:
            "6: The SubCompany and Timing in Employee-Data worksheet has a drop down option please select data from it.",
        });
        worksheet.addRow({
          Tutorial:
            "7: Employee Key in Employee-Data is for software references, please do not alter it.",
        });
        worksheet2.columns = [{ header: "Name", key: "Name", width: 32 }];
        worksheet3.columns = [{ header: "Name", key: "Name", width: 32 }];
        var subcompanydata = await subcomanySchema.find().select("Name -_id");
        for (i = 0; i < subcompanydata.length; i++) {
          worksheet2.addRow({
            Name: subcompanydata[i].Name,
          });
        }
        var datacollect1 = "$A$2:$A$" + (i + 1);
        var timingdata = await timingSchema.find();
        for (i = 0; i < timingdata.length; i++) {
          worksheet3.addRow({
            Name:
              timingdata[i].Name +
              "-" +
              timingdata[i].StartTime +
              "-" +
              timingdata[i].EndTime,
          });
        }
        var datacollect2 = "$A$2:$A$" + (i + 1);
        for (i = 0; i < data.length; i++) {
          if (data[i].Timing != undefined) {
            worksheet1.addRow({
              Key: data[i]._id,
              Name: data[i].Name,
              FName: data[i].FirstName,
              MName: data[i].MiddleName,
              LName: data[i].LastName,
              SubCompany: data[i].SubCompany.Name,
              Timing:
                data[i].Timing.Name +
                "-" +
                data[i].Timing.StartTime +
                "-" +
                data[i].Timing.EndTime,
              Gender: data[i].Gender,
              DOB: data[i].DOB,
              MarritialStatus: data[i].MartialStatus,
              Mobile: data[i].Mobile,
              Mail: data[i].Mail,
              JoinDate: data[i].JoinDate,
              ConfirmationDate: data[i].ConfirmationDate,
              TerminationDate: data[i].TerminationDate,
              Prohibition: data[i].Prohibition,
              IDtype: data[i].Idtype,
              IDnumber: data[i].IDNumber,
              Department: data[i].Department,
              Designation: data[i].Designation,
            });
          } else {
            worksheet1.addRow({
              Key: data[i]._id,
              Name: data[i].Name,
              FName: data[i].FirstName,
              MName: data[i].MiddleName,
              LName: data[i].LastName,
              SubCompany: data[i].SubCompany.Name,
              Gender: data[i].Gender,
              DOB: data[i].DOB,
              MarritialStatus: data[i].MartialStatus,
              Mobile: data[i].Mobile,
              Mail: data[i].Mail,
              JoinDate: data[i].JoinDate,
              ConfirmationDate: data[i].ConfirmationDate,
              TerminationDate: data[i].TerminationDate,
              Prohibition: data[i].Prohibition,
              IDtype: data[i].Idtype,
              IDnumber: data[i].IDNumber,
              Department: data[i].Department,
              Designation: data[i].Designation,
            });
          }
          var count = i + 2;
          var key = "F" + count;
          worksheet1.getCell('"' + key + '"').dataValidation = {
            type: "list",
            allowBlank: false,
            formulae: ["=SubCompany!" + datacollect1],
          };
          var key1 = "G" + count;
          worksheet1.getCell('"' + key1 + '"').dataValidation = {
            type: "list",
            allowBlank: false,
            formulae: ["=Timing!" + datacollect2],
          };
        }
        await workbook.xlsx.writeFile("./bulk/EmployeeRecords.xlsx");
        var result = {
          Message: "Excel Sheet Created",
          Data: "EmployeeRecords.xlsx",
          isSuccess: true,
        };
      } catch (err) {
        var result = {
          Message: "Error in creating excel sheet",
          Data: err,
          isSuccess: true,
        };
        console.log(err);
      }
      res.json(result);
    } else {
      res.json(permission);
    }
  } else if (req.body.type == "uploademployee") {
    var permission = await checkpermission(req.body.type, req.body.token);
    if (permission.isSuccess == true) {
      try {
        filename = req.file.destination + "/" + req.file.filename;
        console.log("Process Start");
        const workbook = new Excel.Workbook();
        var data = {};
        workbook.xlsx.readFile(filename).then(async function () {
          var worksheet = workbook.getWorksheet("Employee-Data");
          i = 0;
          worksheet.eachRow(async function (row, rowNumber) {
            if (rowNumber != 1) {
              data[i] = {
                Key: row.values[1],
                Name: row.values[2],
                FirstName: row.values[3],
                MiddleName: row.values[4],
                LastName: row.values[5],
                SubCompany: row.values[6],
                Timing: row.values[7],
                Gender: row.values[8],
                DOB: row.values[9],
                MartialStatus: row.values[10],
                Mobile: row.values[11],
                Mail: row.values[12],
                JoinDate: row.values[13],
                ConfirmationDate: row.values[14],
                TerminationDate: row.values[15],
                Prohibition: row.values[16],
                Idtype: row.values[17],
                IDNumber: row.values[18],
                Department: row.values[19],
                Designation: row.values[20],
              };
              i++;
            }
          });
          for (i = 0; i < Object.keys(data).length; i++) {
            data[i].Key = data[i].Key.replace(/['"]+/g, "");
            subcompany = await subcompanySchema.find({
              Name: data[i].SubCompany,
            });
            data[i].SubCompany = subcompany[0]._id;
            if (data[i].Timing == undefined) {
              var t = await timingSchema.find().sort("name").limit(1);
              data[i].Timing = t[0]._id;
            } else {
              timing = await timingSchema.find({
                Name: data[i].Timing.split("-")[0],
              });
              data[i].Timing = timing[0]._id;
            }
            await employeeSchema.findOneAndUpdate(
              { _id: mongoose.Types.ObjectId(data[i].Key) },
              {
                Name: data[i].Name,
                FirstName: data[i].FirstName,
                MiddleName: data[i].MiddleName,
                LastName: data[i].LastName,
                SubCompany: data[i].SubCompany,
                Timing: data[i].Timing,
                Gender: data[i].Gender,
                DOB: data[i].DOB,
                MartialStatus: data[i].MartialStatus,
                Mobile: data[i].Mobile,
                Mail: data[i].Mail,
                JoinDate: data[i].JoinDate,
                ConfirmationDate: data[i].ConfirmationDate,
                TerminationDate: data[i].TerminationDate,
                Prohibition: data[i].Prohibition,
                Idtype: data[i].Idtype,
                IDNumber: data[i].IDNumber,
                Department: data[i].Department,
                Designation: data[i].Designation,
              }
            );
          }

          await unlinkAsync(req.file.path);

          var result = {};
          result.Message = "File Upload Successfully";
          result.data = [];
          result.isSuccess = true;
          res.json(result);
        });
      } catch (err) {
        var result = {};
        result.Message = err;
        result.data = [];
        result.isSuccess = false;
        res.json(result);
      }
    } else {
      await unlinkAsync(req.file.path);
      res.json(permission);
    }
  }
});

async function checkpermission(type, token) {
  var result = {};
  if (token != undefined) {
    var admindetails;
    if (type == "employee" || type == "uploademployee") {
      admindetails = await adminSchema.find({ _id: token, "Employee.D": 1 });
    }
    // else if (type == "datememo" || type == "getsinglememodetails") {
    //   admindetails = await adminSchema.find({ _id: token, "Memo.V": 1 });
    // } else if (type == "verifymemo") {
    //   admindetails = await adminSchema.find({ _id: token, "Memo.U": 1 });
    // }
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
