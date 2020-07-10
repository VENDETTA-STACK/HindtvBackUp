$(document).ready(function () {
  var d = new Date();
  var REMOVEFILTER = 1;
  // $("#startdate").val(createdate());
  // $("#enddate").val(createdate());
  // $("#day-filter").val(typeDay());

  // function typeDay() {
  //   var weekday = new Array(7);
  //   weekday[0] = "Sunday";
  //   weekday[1] = "Monday";
  //   weekday[2] = "Tuesday";
  //   weekday[3] = "Wednesday";
  //   weekday[4] = "Thursday";
  //   weekday[5] = "Friday";
  //   weekday[6] = "Saturday";
  //   day = weekday[d.getDay()];
  //   return day;
  // }

  // function createdate() {
  //   var month = d.getMonth() + 1;
  //   var day = d.getDate();
  //   date =
  //     d.getFullYear() +
  //     "-" +
  //     (month < 10 ? "0" : "") +
  //     month +
  //     "-" +
  //     (day < 10 ? "0" : "") +
  //     day;
  //   return date;
  // }

  var id = $(location).attr("href").split("=")[1];
  if (id != undefined) {
    loadsingleemployee();
  } else {
    loaddata();
  }

  function loadsingleemployee() {
    var afilter = $("#area-filter").val();
    $.ajax({
      type: "POST",
      url: $("#website-url").attr("value") + "attendance",
      data: { type: "getsingle", EmployeeId: id, afilter: afilter },
      dataType: "json",
      cache: false,
      beforeSend: function () {
        $("#displaydata").html(
          '<tr><td colspan="8" class="text-center font-weight-bold">Loading...</td></tr></center>'
        );
      },
      success: function (data) {
        if (data.isSuccess == true) {
          $("#displaydata").html("");
          for (i = 0; i < data.Data.length; i++) {
            data.Data[i]["Area"] =
              data.Data[i]["Area"] == undefined ? "-" : data.Data[i]["Area"];
            $("#displaydata").append(
              "<tr><td>" +
                data.Data[i].EmployeeId["Name"] +
                "</td><td>" +
                data.Data[i].EmployeeId["Mobile"] +
                "</td><td>" +
                data.Data[i]["Day"] +
                "</td><td>" +
                data.Data[i]["Date"] +
                "</td><td>" +
                data.Data[i]["Time"] +
                "</td><td>" +
                "<a href = " +
                $("#website-url").attr("value") +
                "public/images/attendance/" +
                data.Data[i]["Image"] +
                " target=_blank>View Image</a>" +
                "</td><td>" +
                data.Data[i]["Area"] +
                "</td><td>" +
                data.Data[i]["Status"].toUpperCase() +
                "</td></tr>"
            );
          }
        } else {
          $("#displaydata").html(
            '<tr><td colspan="8" class="text-center font-weight-bold">No Records Found.</td></tr></center>'
          );
        }
      },
    });
  }

  function loaddata() {
    var afilter = $("#area-filter").val();
    sd = convertdatetostring($("#startdate").val());
    ed = convertdatetostring($("#enddate").val());
    day = $("#day-filter").val();
    status = $("#status-filter").val();
    $.ajax({
      type: "POST",
      url: $("#website-url").attr("value") + "attendance",
      data: {
        type: "getdata",
        afilter: afilter,
        sd: sd,
        ed: ed,
        rm: REMOVEFILTER,
        day: day,
        status: status,
      },
      dataType: "json",
      cache: false,
      beforeSend: function () {
        $("#displaydata").html(
          '<tr><td colspan="8" class="text-center font-weight-bold">Loading...</td></tr></center>'
        );
      },
      success: function (data) {
        if (data.isSuccess == true) {
          $("#displaydata").html("");
          for (i = 0; i < data.Data.length; i++) {
            data.Data[i]["Day"] =
              data.Data[i]["Day"] == undefined ? "-" : data.Data[i]["Day"];
            data.Data[i]["Time"] =
              data.Data[i]["Time"] == undefined ? "-" : data.Data[i]["Time"];
            data.Data[i]["Area"] =
              data.Data[i]["Area"] == undefined ? "-" : data.Data[i]["Area"];
            $("#displaydata").append(
              "<tr><td>" +
                data.Data[i].EmployeeId["Name"] +
                "</td><td>" +
                data.Data[i].EmployeeId["Mobile"] +
                "</td><td>" +
                data.Data[i]["Day"] +
                "</td><td>" +
                data.Data[i]["Date"] +
                "</td><td>" +
                data.Data[i]["Time"] +
                "</td><td>" +
                "<a href = " +
                $("#website-url").attr("value") +
                "public/images/attendance/" +
                data.Data[i]["Image"] +
                " target=_blank>View Image</a>" +
                "</td><td>" +
                data.Data[i]["Area"] +
                "</td><td>" +
                data.Data[i]["Status"].toUpperCase() +
                "</td></tr>"
            );
          }
        } else {
          $("#displaydata").html(
            '<tr><td colspan="8" class="text-center font-weight-bold">No Records Found.</td></tr></center>'
          );
        }
      },
    });
  }

  $(document).on("click", "#btn-remove-filter", function (e) {
    e.preventDefault();
    REMOVEFILTER = 1;
    var id = $(location).attr("href").split("=")[1];
    if (id != undefined) {
      loadsingleemployee();
    } else {
      loaddata();
    }
  });

  $(document).on("click", "#btn-apply-filter", function (e) {
    e.preventDefault();
    REMOVEFILTER = 0;
    var id = $(location).attr("href").split("=")[1];
    if (id != undefined) {
      loadsingleemployee();
    } else {
      loaddata();
    }
  });

  function convertdatetostring(date) {
    alert(date);
    if (date != "" || date != undefined) {
      date = date.split("-");
      date = date[2] + "/" + date[1] + "/" + date[0];
    } else {
      date = "";
    }
    return date;
  }
});
