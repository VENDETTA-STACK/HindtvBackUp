/*Importing Modules */
var express = require("express");
var router = express.Router();
var employeeSchema = require("../models/employee.model");
/*Importing Modules */

/* Post request for login
  type = login : Login into mobile application
*/
router.post("/", function (req, res, next) {
  if (req.body.type == "login") {
    employeeSchema.find({ Mobile: req.body.number }, function (err, record) {
      var result = {};
      if (err) {
        result.Message = "Employee Not Found";
        result.Data = [];
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "Employee Not Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "Employee Found";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  }
  
});

module.exports = router;
