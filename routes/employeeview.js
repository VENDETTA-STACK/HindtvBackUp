/*Importing Modules */
var express = require("express");
var router = express.Router();
var employeeSchema = require("../models/employee.model");
var subcompanySchema = require("../models/subcompany.models");
var adminSchema = require("../models/admin.model");
var timingSchema = require("../models/timing.models");
/*Importing Modules */

/*Post request for employee
  There are different type use for various activities
  type = insert : Insert a new employee,
  type = update : Update an individual employee
  type = getdata : Returns data of all employee
  type = gettiming : Returns data of all timing store for employee
  type = getsingledata : For editing fetches a single data of an user
  type = getsubcompanyemployee : Need to be shifted from it's call

  function checkpermission() : It checks whether you have a correct token to access data and also checks whether you have the rights to Add,View,Update the data.
*/

/*
    It's display all employee's details.
    Editied by Dhanpal
*/
router.post('/',async function(req, res, next){
    if(req.body.type=="getdata"){
        var permission = await checkpermission(req.body.type, req.body.token);
        if (permission.isSuccess == true) {
        var companyselection = await adminSchema.findById(req.body.token);
        if (companyselection.allaccessubcompany == true) {
            var record = await employeeSchema.find({}).populate("SubCompany");
            var result = {};
            if (record.length == 0) {
            result.Message = "Employee Not Found";
            result.Data = [];
            result.isSuccess = false;
            } else {
            result.Message = "Employee Found";
            result.Data = record;
            result.isSuccess = true;
            }
            res.json(result);
        } else {
            var record = await employeeSchema
            .find({ SubCompany: companyselection.accessCompany })
            .populate("SubCompany");
            var result = {};
            if (record.length == 0) {
            result.Message = "Employee Not Found";
            result.Data = [];
            result.isSuccess = false;
            } else {
            result.Message = "Employee Found";
            result.Data = record;
            result.isSuccess = true;
            }
            res.json(result);
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
      if (type == "getdata") {
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
