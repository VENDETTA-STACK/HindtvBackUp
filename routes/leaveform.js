/*Importing Modules */
var express = require("express");
var router = express.Router();
var masterLeaveLevelSchema = require("../models/masterLeaveLevel.model");
/*Importing Modules */

/* Post request for location
  type = getnamefrommobile : Get current location from firebase,
*/
router.post("/", async (req, res) => {
  if(req.body.type == "insert") {
      //var permission = await checkpermission(req.body.type, req.body.token);

        var record = new masterLeaveLevelSchema({
          MasterName:req.body.name,
          Status:req.body.status,
          MasterType:req.body.type,
        });

      record.save({}, function (err, record) {
        var result = {};
        if (err) {
          result.Message = "Record Not Inserted";
          result.Data = err;
          result.isSuccess = false;
        } else if (record.length == 0) {
            result.Message = "Record Not Inserted";
            result.Data = [];
            result.isSuccess = false;
        } else {
            result.Message = "Record Inserted";
            result.Data = record;
            result.isSuccess = true;
        }
        res.json(result);
      });
    }
});

router.get("/",async function(req,res){
  var data = await masterLeaveLevelSchema.find({});
  if(data.length > 0){
    res.json({
      Message:"DATA Found",
      Data:data,
      isSuccess:true
    });
  }
  else if (data.length == 0){
      res.json({
        Message:"ERROR",
        Data:{},
        isSuccess:False
      });
  }
    else{
      res.json({
        Message:"ERROR",
        Data:{},
        isSuccess:False
      });
    }
});

module.exports = router;
