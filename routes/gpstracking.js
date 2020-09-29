/*Importing Modules */
var express = require("express");
const { result } = require("lodash");
var router = express.Router();
var gpstrackingSchema = require("../models/gpstracking.model");
/*Importing Modules */


router.post("/", async function(req,res){
    if(req.body.type == "insert"){
        var record = gpstrackingSchema({
            EmployeeId:req.body.employeeid,
            Date:req.body.date,
            Time:req.body.time,
            Latitude:req.body.latitude,
            Longitude:req.body.longitude
        });
        record.save({}, function(err,record){
            var result = {};
            if(err){
                result.Message="Location is not Inserted.";
                result.Data=[];
                result.isSuccess=false;
            } else {
                if(record.length == 0){
                    result.Message="Location is not Inserted.";
                    result.Data=[];
                    result.isSuccess=false;
                }
                else{
                    result.Message="Location is Inserted.";
                    result.Data=record;
                    result.isSuccess=true;
                }
            }
            res.json(result);
        });
    }
    else if(req.body.type == "getdata"){
        console.log("call");
        var record = await gpstrackingSchema.find({EmployeeId:req.body.employeeid,Date:req.body.date});
        var result = {};
        if(record.length == 0){
            result.Message="Tracking data is not found.";
            result.Data=[];
            result.isSuccess=false;
        }
        else{
            result.Message="Tracking data is found.";
            result.Data=record;
            result.isSuccess=true;
        }
        res.json(result);
    }
});
module.exports = router;
