/*Importing Modules */
var express = require("express");
const { result } = require("lodash");
var router = express.Router();
var locationSchema = require("../models/location.model");
/*Importing Modules */

// this api for add subcompany location in map
// insert api is using in frontend.
//created by 29.09 dhanpal
router.post('/',async function(req,res){  
        if(req.body.type=="insert"){
            var record = locationSchema({
                Name:req.body.name,
                SubCompanyId:req.body.subcompanyid,
                Latitude:req.body.latitude,
                Longitude:req.body.longitude,
                Link:req.body.link,
            });
            record.save({},(err,record)=>{
                var result = {};
                if(err){
                    result.Message = "Location is not inserted.";
                    result.Data = [];
                    result.isSuccess = false;
                }
                else{
                    if(record.length==0){
                        result.Message = "Location is not inserted.";
                        result.Data = [];
                        result.isSuccess = false;
                    }
                    else{
                        result.Message = "Location is inserted.";
                        result.Data = record;
                        result.isSuccess = true;
                    }
                }
                res.json(result);
            });            
        }
    
        else if(req.body.type=="update"){
            locationSchema.update({SubCompanyId:req.body.subcompanyid},{
                Name:req.body.name,
                Latitude:req.body.latitude,
                Longitude:req.body.longitude,
                Link:req.body.link
            },(err,record)=>{
                var result = {};
                if(err){
                    result.Message = "Location is not updated.";
                    result.Data = [];
                    result.isSuccess = false;
                }
                else{
                    if(record.length==0){
                        result.Message = "Location is not updated.";
                        result.Data = [];
                        result.isSuccess = false;
                    }
                    else{
                        result.Message = "Location is updated.";
                        result.Data = record;
                        result.isSuccess = true;
                    }
                }
                res.json(result);
            });
        }

        else if(req.body.type=="getdata"){
            var record = await locationSchema.find().populate({
                path:"SubCompanyId",
                select:"Name"
            });
            var result = {};
            if(record.length==0){
                result.Message = "Location is not found.";
                result.Data = [];
                result.isSuccess = false;
            }
            else{
                result.Message = "Location is found.";
                result.Data = record;
                result.isSuccess = true;
            }
            res.json(result);
          
        }

        else if(req.body.type=="getsingledata"){
            var record = await locationSchema.find({_id:req.body.id});
            var result = {};
            if(record.length==0){
                result.Message = "Location is not found.";
                result.Data = [];
                result.isSuccess = false;
            }
            else{
                result.Message = "Location is found.";
                result.Data = record;
                result.isSuccess = true;
            }
            res.json(result);
          
        }

        else if(req.body.type=="delete"){
            locationSchema.findByIdAndRemove(req.body.id,(err,record)=>{
                var result = {};
                if(err){
                    result.Message = "Location is not found.";
                    result.Data = [];
                    result.isSuccess = false;
                }
                else{
                    if(record.length==0){
                        result.Message = "Location is not found.";
                        result.Data = [];
                        result.isSuccess = false;
                    }
                    else{
                        result.Message = "Location is deleted.";
                        result.Data = record;
                        result.isSuccess = true;
                    }
                }
                res.json(result);
            });
        }
});

module.exports = router;
