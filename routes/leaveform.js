/*Importing Modules */
var express = require("express");
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
            DOL: req.body.ldate,
            Description: req.body.description,
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
});

module.exports = router;
//Updated 26.08 by dhanpal