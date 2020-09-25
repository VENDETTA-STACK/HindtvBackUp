var express = require('express');
var router = express.Router();
var model = require('../models/test.model');

// router.post('/',function(req,res,next){
//     console.log(req.body);
//     if(req.body.type == "login"){
//         var record = new model({
//             mobile : req.body.mobile
//         });
//         console.log(record);
//         record.save();
//         return res.status(200).send({success: true, data: record});
//     }
//     else{
//         res.status(404).send("404 ERROR")
//     }
// });

router.post('/',async function(req,res){

    var mobile_data = await model.findOne({ mobile: req.body.mobile});
    if(mobile_data.length == 0){
        var result = {};
        result.Message= "Not Found.";
        result.Data = [];
        result.isSuccess = false;
        res.json(result);
    }
    else{
        var result = {};
        result.Message= " Found.";
        result.Data = mobile_data;
        result.isSuccess = true;
        res.json(result);
    }
    
    // console.log(JSON.parse(mobile_data));
    // var query = { mobile : mobile };  
    // var record = await model.find(query);
    // console.log(record);
    // res.json(record);
  });

module.exports = router;