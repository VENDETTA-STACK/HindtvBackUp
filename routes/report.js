/*Importing Modules */
var express = require("express");
var router = express.Router();
var moment = require("moment-timezone");
var attendeanceSchema = require("../models/attendance.models");
var memoSchema = require("../models/memo.model");
var adminSchema = require("../models/admin.model");
var subcompanySchema = require("../models/subcompany.models");
var Excel = require("exceljs");
const mongoose = require("mongoose");
var _ = require("lodash");
const { enabled } = require("debug");
const { database } = require("firebase-admin");
const { isEqual, replace } = require("lodash");
const memo = require("../models/memo.model");
const morgan = require("morgan");
/*Importing Modules */

var convertedDate = function () {
    var now = new Date();
    date = dateFormat(now, "isoDateTime");
    date =
      date[8] +
      date[9] +
      "/" +
      date[5] +
      date[6] +
      "/" +
      date[0] +
      date[1] +
      date[2] +
      date[3];
    return date;
};
var dateArray = [];
/* Create Date according to the given date.
    Reason:Generate Starting Date and Ending date of the given month.
    Required : Generate Date and it will use in column of excelsheet.
    Created : Dhanpal 7-09-2020
*/
var countDate = function(mm,yyyy){
    var year=parseInt(yyyy);
    var months=parseInt(mm);
    var startdate;
    var enddate;
    if (
    months == 01 ||
    months == 03 ||
    months == 05 ||
    months == 07 ||
    months == 08 ||
    months == 10 ||
    months == 12
    ) {
    startdate = 01;
    enddate = 31;
    } else if (
    months == 04 ||
    months == 06 ||
    months == 09 ||
    months == 11
    ) {
    startdate = 01;
    enddate = 30;
    } else if (months == 02) {
    startdate = 01;
    if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
        enddate = 29;
        
    } else {
        enddate = 28;
    }
    }
    for(var index=parseInt(startdate);index<=parseInt(enddate);index++){
        if(months>9 && index<=9){
            dateArray[index] = '0'+index+'/'+months+'/'+year
        }
        else if(months<=9 && index > 9){
            dateArray[index] = index+'/0'+months+'/'+year
        }
        else if(months<=9 && index <= 9){
            dateArray[index] = '0'+index+'/0'+months+'/'+year
        }
        else if(months>9 && index > 9){
            dateArray[index] = +index+'/'+months+'/'+year
        }
    }
}

/* str function create a Array of Alphabet Character
    Reason : it's required for access the excelsheet cell.
    Created By Dhanpal 7-09-2020
*/ 
var cellArray = [];
function str(i){
    return i<0 ? "" : str(i/26-1)+String.fromCharCode(65+i%26);
}
for(var i=0;i<27*27;i++){
    cellArray[i] = str(i);
}


router.post("/", async(req, res) => {
    if (req.body.type == "attendancereport") {
        var permission = await checkpermission(req.body.type, req.body.token);
        if (permission.isSuccess == true) {
            try {
                countDate(req.body.month,req.body.year);
                var startdate,enddate;
                startdate = dateArray[1];
                enddate = dateArray[dateArray.length-1];
                record = await attendeanceSchema
                    .find({
                        Date: {
                            $gte:startdate,
                            $lte:enddate
                            //$gte: req.body.startdate,
                            //$lte: req.body.enddate,
                        },
                    })
                    .select("Status Date Time Day")
                    .populate({
                        path: "EmployeeId",
                        select: "Name",
                        match: {
                            SubCompany: mongoose.Types.ObjectId(req.body.company),
                        },
                    });
                /**
                 * Reason memorecord-> Fetch memo record of employee particular date wise and performing groupby using EmployeeName.
                 * Updated By: Dhanpal 7-09-2020
                 */
                memorecord  = await memoSchema
                    .find({
                        Date:{
                            $gte:startdate,
                            $lte:enddate,
                        }
                    })
                    .select("Date")
                    .populate({
                        path: "Eid",
                        select : "Name",
                        match: {
                            SubCompany: mongoose.Types.ObjectId(req.body.company),
                        },
                    });
                
                var mresult = [];
                memorecord.map(async(memorecords) => {
                    if(memorecords.Eid != null){
                        mresult.push(memorecords);
                    }
                });
                if(mresult.length >= 0){
                    var mresult = _.groupBy(mresult, "Eid.Name");
                    mresult = _.forEach(mresult, function(value, key){
                        mresult[key] = _.groupBy(mresult[key], function(item){
                            return item.Date;
                        })
                    });
                }

                /**
                 * Reason record-> Fetch attendance record of employee on particular date wise and performing groupby using EmployeeName.
                 * Updated By: 
                 */
                
                if (record.length >= 0) {
                    var result = [];
                    record.map(async(records) => {
                        if (records.EmployeeId != null) {
                            result.push(records);
                        }
                    });
                    var memoresult = result;
                    if (result.length >= 0) {
                        var result = _.groupBy(result, "EmployeeId.Name");
                        result = _.forEach(result, function(value, key) {
                            result[key] = _.groupBy(result[key], function(item) {
                                return item.Date;
                            });
                        });

                        result = _.forEach(result, function(value, key) {
                            _.forEach(result[key], function(value, key1) {
                                result[key][key1] = _.groupBy(result[key][key1], function(
                                    item
                                ) {
                                    return item.Status;
                                });
                            });
                        });
                        
                        /*
                        * Start the designing of excelsheet.
                        */
                        try {
                            var workbook = new Excel.Workbook();
                            var worksheet = workbook.addWorksheet("Attendance Report");
                            //var worksheet1 = workbook.addWorksheet("Memo Report");
                            worksheet.mergeCells('B2:C2');
                            worksheet.mergeCells('C1:F1');
                            worksheet.getCell('C1').value = "Performance Report";
                            worksheet.getCell('C2').value = "SubCompany Name";
                            worksheet.getCell('C2').width = "32";
                            worksheet.getCell('D2').value = req.body.name;
                            worksheet.getCell('A3').value = "P => Present";
                            worksheet.getCell('A4').value = "A => Absent";
                            worksheet.getCell('A5').value = "L => Late";
                            worksheet.getCell('A6').value = "HD => Half-Day";
                            worksheet.getCell('A8').value = "Employee Name";
                            /**
                             * Reason:Code for pattern of the header desing of excel sheet.
                             * Updated By Dhanpal 07-09-2020
                             */
                           
                            /*worksheet.columns = [
                                {key: "Name", width: 32},
                                {key: "Date", width: 32},
                                {key: "Day", width: 32},
                                {key: "Status", width: 32},
                                {key: "InTime", width: 32},
                                {key: "OutTime", width: 32},
                                {key: "DifferenceTime",width: 28}
                            ];*/
                            /*for(var index=1;index<=26;index++){
                                worksheet.getCell(String.fromCharCode(index+64)+9).value = index;
                            }*/

                            /*
                            worksheet.columns = [
                                { header: "Employee Name", key: "Name", width: 32 },
                                { header: "Date", key: "Date", width: 32 },
                                { header: "Day", key: "Day", width: 15 },
                                { header: "Status", key: "Status", width: 15 },
                                { header: "In Time", key: "InTime", width: 15 },
                                { header: "Out Time", key: "OutTime", width: 15 },
                                {
                                    header: "Total Working Hour",
                                    key: "DifferenceTime",
                                    width: 28,
                                }
                            ];*/
                            /*worksheet1.columns = [
                                { header: "Employee Name", key: "Name", width: 32 },
                                { header: "Memo Type", key: "Type", width: 15 },
                                { header: "Start and End Date", key: "Date", width: 30 },
                                { header: "Memo Accepted", key: "Accepted", width: 15 },
                                { header: "Memo Disapproved", key: "Disapproved", width: 15 },
                            ];*/

                            var rowindex  = 8;
                            worksheet.columns = [{key: "Name", width: 32}];
                            var colindex = 0;
                            //Print Date in the header coloumn.
                            for(var datecol=1;datecol<=dateArray.length-1;datecol++){
                                worksheet.getCell(cellArray[colindex+1]+rowindex).value = dateArray[datecol];
                                colindex++;
                            }
                            
                            for (var key in result){
                                var tempIndex = 0;
                                var lemployee = []; //store data of late comer employee
                                for(var key1 in mresult[key]){
                                    lemployee[tempIndex] = key1;
                                    tempIndex++;
                                }
                                var employeedate  = [];
                                tempIndex = 0;
                                for (var key1 in result[key]){
                                    employeedate[tempIndex] = key1; //store data of present employee
                                    tempIndex++;
                                }
                                worksheet.addRow({Name: key});
                                colindex = 0;
                                for(var datecol=1;datecol<=dateArray.length-1;datecol++){
                                    if(lemployee.findIndex(item => item == dateArray[datecol])!=-1){
                                        worksheet.getCell(cellArray[colindex+1]+parseInt(rowindex+1)).value = "L";
                                    }
                                    else if(employeedate.findIndex(item => item == dateArray[datecol])!=-1){
                                        worksheet.getCell(cellArray[colindex+1]+parseInt(rowindex+1)).value = "P";
                                    }
                                    else{
                                        worksheet.getCell(cellArray[colindex+1]+parseInt(rowindex+1)).value = "A";
                                    }
                                    colindex++;
                                }
                                rowindex = parseInt(rowindex+1);
                            }
                            
                            /*
                            for (var key in result) {
                                for (var key1 in result[key]) {
                                    var i = 0;
                                    for (var key2 in result[key][key1]) {
                                        if (key2 == "in") {
                                            // check outTime data exists or not
                                            if (result[key][key1]["out"] == undefined) {
                                                var outTime = "11:00:00 pm";
                                            } else {
                                                var outTime = result[key][key1]["out"][i].Time;
                                            }
                                            worksheet.addRow({
                                                Name: key,
                                                Date: key1,
                                                Day: result[key][key1][key2][i].Day,
                                                Status: "P",
                                                InTime: result[key][key1][key2][i].Time,
                                                OutTime: outTime,
                                                DifferenceTime: calculateTime(
                                                    result[key][key1][key2][i].Time,
                                                    outTime
                                                ),
                                            });
                                        }
                                    }
                                    i++;
                                }
                            }*/


//memo report //

                            /*for (i = 0; i < memoresult.length; i++) {
                                var memoData = await memoSchema
                                    .find({
                                        Eid: memoresult[i].EmployeeId._id,
                                        Type: memoresult[i].Status,
                                        Date: {
                                            $gte: req.body.startdate,
                                            $lte: req.body.enddate,
                                        },
                                    })
                                    .populate("Eid", "Name");
                                if (memoData !== undefined && memoData.length >= 0) {
                                    var groupmemo = _.groupBy(memoData, "Eid.Name");
                                    var approved = 0,
                                        disapproved = 0;
                                    // console.log(groupmemo);
                                    for (var key in groupmemo) {
                                        for (j = 0; j < groupmemo[key].length; j++) {
                                            if (groupmemo[key][j].Status == true) {
                                                approved++;
                                            } else {
                                                disapproved++;
                                            }
                                        }
                                        worksheet1.addRow({
                                            Name: key,
                                            Type: groupmemo[key][0].Type,
                                            Date: req.body.startdate + " - " + req.body.enddate,
                                            Accepted: approved,
                                            Disapproved: disapproved,
                                        });
                                    }
                                }
                            }*/

                            await workbook.xlsx.writeFile(
                                "./reports/" + req.body.name + ".xlsx"
                            );
                            var result = {
                                Message: "Excel Sheet Created",
                                Data: req.body.name + ".xlsx",
                                isSuccess: true,
                            };
                        } catch (err) {
                            var result = {
                                Message: "Error in creating excel sheet",
                                Data: err,
                                isSuccess: false,
                            };
                            console.log("OOOOOOO this is the error: " + err);
                        }
                        res.json(result);
                    } else {
                        var result = {
                            Message: "Excel Sheet Not Created",
                            Data: "No Data Found",
                            isSuccess: false,
                        };
                        res.json(result);
                    }
                } else {
                    var result = {
                        Message: "Excel Sheet Not Created",
                        Data: "No Data Found",
                        isSuccess: false,
                    };
                    res.json(result);
                }
            } catch (err) {
                var result = {
                    Message: "Excel Sheet Not Created",
                    Data: err,
                    isSuccess: false,
                };
            }
        } else {
            res.json(permission);
            var result = {
                Message: "Excel Sheet Not Created",
                Data: "No Data Found",
                isSuccess: false,
            };
            res.json(result);
        }
    } else if (req.body.type == "employeeattendancereport") {
        var permission = await checkpermission(req.body.type, req.body.token);
        if (permission.isSuccess == true) {
            try {
                record = await attendeanceSchema
                    .find({
                        EmployeeId: mongoose.Types.ObjectId(req.body.EmployeeId),
                        Date: {
                            $gte: req.body.startdate,
                            $lte: req.body.enddate,
                        },
                    })
                    .select("Status Date Time Day")
                    .populate({
                        path: "EmployeeId",
                        select: "Name"
                    });
                if (record.length >= 0) {
                    var result = [];
                    record.map(async(records) => {
                        if (records.EmployeeId != null) {
                            result.push(records);
                        }
                    });
                    var memoresult = result;

                    if (result.length >= 0) {
                        var result = _.groupBy(result, "EmployeeId.Name");
                        result = _.forEach(result, function(value, key) {
                            result[key] = _.groupBy(result[key], function(item) {
                                return item.Date;
                            });
                        });
                        result = _.forEach(result, function(value, key) {
                            _.forEach(result[key], function(value, key1) {
                                result[key][key1] = _.groupBy(result[key][key1], function(
                                    item
                                ) {
                                    return item.Status;
                                });
                            });
                        });
                        try {
                            var workbook = new Excel.Workbook();
                            var worksheet = workbook.addWorksheet("Attendance Report");
                            var worksheet1 = workbook.addWorksheet("Memo Report");
                            worksheet.columns = [
                                { header: "Employee Name", key: "Name", width: 32 },
                                { header: "Date", key: "Date", width: 32 },
                                { header: "Day", key: "Day", width: 15 },
                                { header: "Status", key: "Status", width: 15 },
                                { header: "In Time", key: "InTime", width: 15 },
                                { header: "Out Time", key: "OutTime", width: 15 },
                                {
                                    header: "Total Working Hour",
                                    key: "DifferenceTime",
                                    width: 28,
                                },

                            ];

                            worksheet1.columns = [
                                { header: "Employee Name", key: "Name", width: 32 },
                                { header: "Memo Type", key: "Type", width: 15 },
                                { header: "Start and End Date", key: "Date", width: 30 },
                                { header: "Memo Accepted", key: "Accepted", width: 15 },
                                { header: "Memo Disapproved", key: "Disapproved", width: 15 },
                            ];

                            for (var key in result) {
                                for (var key1 in result[key]) {
                                    var i = 0;
                                    for (var key2 in result[key][key1]) {
                                        if (key2 == "in") {
                                            // check outTime data exists or not
                                            if (result[key][key1]["out"] == undefined) {
                                                var outTime = "11:00:00 pm";
                                            } else {
                                                var outTime = result[key][key1]["out"][i].Time;
                                            }
                                            worksheet.addRow({
                                                Name: key,
                                                Date: key1,
                                                Day: result[key][key1][key2][i].Day,
                                                Status: "P",
                                                InTime: result[key][key1][key2][i].Time,
                                                OutTime: outTime,
                                                DifferenceTime: calculateTime(
                                                    result[key][key1][key2][i].Time,
                                                    outTime
                                                ),
                                            });
                                        }
                                    }
                                    i++;
                                }
                            }
                            for (i = 0; i < memoresult.length; i++) {
                                var memoData = await memoSchema
                                    .find({
                                        Eid: memoresult[i].EmployeeId._id,
                                        Type: memoresult[i].Status,
                                        Date: {
                                            $gte: req.body.startdate,
                                            $lte: req.body.enddate,
                                        },
                                    })
                                    .populate("Eid", "Name");
                                if (memoData !== undefined && memoData.length >= 0) {
                                    var groupmemo = _.groupBy(memoData, "Eid.Name");
                                    var approved = 0,
                                        disapproved = 0;
                                    // console.log(groupmemo);
                                    for (var key in groupmemo) {
                                        for (j = 0; j < groupmemo[key].length; j++) {
                                            if (groupmemo[key][j].Status == true) {
                                                approved++;
                                            } else {
                                                disapproved++;
                                            }
                                        }
                                        worksheet1.addRow({
                                            Name: key,
                                            Type: groupmemo[key][0].Type,
                                            Date: req.body.startdate + " - " + req.body.enddate,
                                            Accepted: approved,
                                            Disapproved: disapproved,
                                        });
                                    }
                                }
                            }

                            await workbook.xlsx.writeFile(
                                "./reports/" + req.body.name + ".xlsx"
                            );
                            var result = {
                                Message: "Excel Sheet Created",
                                Data: req.body.name + ".xlsx",
                                isSuccess: true,
                            };
                        } catch (err) {
                            var result = {
                                Message: "Error in creating excel sheet",
                                Data: err,
                                isSuccess: false,
                            };
                            console.log("OOOOOOO this is the error: " + err);
                        }
                        res.json(result);
                    } else {
                        var result = {
                            Message: "Excel Sheet Not Created",
                            Data: "No Data Found",
                            isSuccess: false,
                        };
                        res.json(result);
                    }
                } else {
                    var result = {
                        Message: "Excel Sheet Not Created",
                        Data: "No Data Found",
                        isSuccess: false,
                    };
                    res.json(result);
                }
            } catch (err) {
                var result = {
                    Message: "Excel Sheet Not Created",
                    Data: err,
                    isSuccess: false,
                };
            }
        } else {
            res.json(permission);
            var result = {
                Message: "Excel Sheet Not Created",
                Data: "No Data Found",
                isSuccess: false,
            };
            res.json(result);
        }
    }
});

function calculateTime(inTime, outTime) {
    var startTime = moment(inTime, "HH:mm:ss a");
    var endTime = moment(outTime, "HH:mm:ss a");
    var duration = moment.duration(endTime.diff(startTime));
    var hours = parseInt(duration.asHours());
    var minutes = parseInt(duration.asMinutes()) % 60;
    return hours + " hour and " + minutes + " minutes.";
}

async function checkpermission(type, token) {
    var result = {};
    if (token != undefined) {
        var admindetails;
        if (type == "attendancereport") {
            admindetails = await adminSchema.find({ _id: token, "Report.D": 1 });
        } //else if (type == "datememo" || type == "getsinglememodetails") {
        //   admindetails = await adminSchema.find({ _id: token, "Report.V": 1 });
        // } else if (type == "verifymemo") {
        //   admindetails = await adminSchema.find({ _id: token, "Report.U": 1 });
        // }

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