var express = require('express');
var router = express.Router();
var model = require('../models/test.model');

/* POST Personal Directory. */
router.post('/:name', function(req, res, next) {
  var name = req.params.name;
  console.log(req.body);

  var found = false;

  var record = new model({
    date_of_birth : req.body.date_of_birth,
    gender : req.body.gender,
    address : req.body.address,
    spouse_name : req.body.spouse_name,
    spouse_birth_date : req.body.spouse_birth_date,
    number_of_child : req.body.number_of_child,
  });

  model.findOneAndUpdate({name:req.params.name},{
    date_of_birth : req.body.date_of_birth,
    gender : req.body.gender,
    address : req.body.address,
    spouse_name : req.body.spouse_name,
    spouse_birth_date : req.body.spouse_birth_date,
    number_of_child : req.body.number_of_child,
  },(err,record)=>{
    var result = {};
    if(err){
      result.Message= "Not Found.";
      result.Data = [];
      result.isSuccess = false;
    }
    else{
      result.Message= "Found.";
      result.Data = record;
      result.isSuccess = true;
    }
    res.json(result);
  });

  // var update_record =  model.forEach(function(person,index){
  //       if(!found && person.name === name){
  //           person.date_of_birth = record.date_of_birth;
  //           person.gender = record.gender;
  //           person.address = record.address;
  //           person.spouse_name = record.spouse_name;
  //           person.spouse_birth_date = record.spouse_birth_date;
  //           person.number_of_child = record.number_of_child;
  //       }
  //   });
    // console.log(record);
    // update_record.save();
    // res.send(json(update_record));

  // if(req.body.name == "insert"){
    
  //   var record = new model({
  //       date_of_birth : req.body.date_of_birth,
  //       gender : req.body.gender,
  //       address : req.body.address,
  //       spouse_name : req.body.spouse_name,
  //       spouse_birth_date : req.body.spouse_birth_date,
  //       number_of_child : req.body.number_of_child,
  //   });
  //   console.log(record);
  //   record.save();
  //   res.json(record);
  //   //return res.status(200).send({success: true, data: record});
  // }
  // else{
  //   res.status(404).send("404 ERROR");
  // }
});


module.exports = router;