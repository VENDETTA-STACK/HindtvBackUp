var express = require('express');
var router = express.Router();
var model = require('../models/test.model');

/* GET home page. */ 
router.post('/', async function(req, res, next) {
  console.log(req.body);
  if(req.body.type == "insert"){
    var record = new model({
      name : req.body.name,
      mobile : req.body.mobile,
      email : req.body.email,
      company_name : req.body.company_name,
      referred_by : req.body.referred_by,
      date_of_birth : req.body.date_of_birth,
      gender : req.body.gender,
      address : req.body.address,
      spouse_name : req.body.spouse_name,
      spouse_birth_date : req.body.spouse_birth_date,
      number_of_child : req.body.number_of_child,
    });
    console.log(record);
    record.save();
    return res.status(200).send({success: true, data: record});
  }
  else{
    res.status(404).send("404 ERROR");
  }

  //res.render('index', { title: 'Express' });
});

router.get('/:id',async function(req,res){
  var name = req.params.id;
  // var name = req.body.name;
  var query = { name : name };  
  // var record = await model.findById(name,{});
  var record = await model.find(query);
  console.log(record);
  res.json(record);
  // if(record){
  //   res.status(200).send(`Found Records : ${json(record)}`);
  // }
  // else{
  //   res.status(404).send("404 ERROR");
  // }
});

module.exports = router;



//git remote add origin git@github.com:VENDETTA-STACK/blog-vlog.git