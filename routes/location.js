/*Importing Modules */
var express = require("express");
var router = express.Router();
var firebase = require("firebase-admin");
var employeeSchema = require("../models/employee.model");
/*Importing Modules */

/* Post request for location
  type = getnamefrommobile : Get current location from firebase,  
*/
router.post("/", async (req, res) => {
  if (req.body.type == "getnamefrommobile") {
    record = await employeeSchema
      .find({ Mobile: req.body.mobile })
      .select("Name Mobile");
    res.json(record);
  } else {
    var dbRef = firebase.database().ref("Database");
    const data = await dbRef.once("value", function (snapshot) {
      return snapshot.val();
    });
    res.json(data);
  }
});

module.exports = router;
