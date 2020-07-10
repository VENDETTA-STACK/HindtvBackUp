$(document).ready(function () {
  loaddata();
  loadsubcompany();
  loadtiming();

  var UPDATEID;
  var TIMING;

  function loadsubcompany() {
    $.ajax({
      type: "POST",
      url: $("#website-url").attr("value") + "employee",
      data: { type: "getsubcompany" },
      dataType: "json",
      cache: false,
      success: function (data) {
        if (data.isSuccess == true) {
          $("#subcompany").html("");
          for (i = 0; i < data.Data.length; i++) {
            $("#subcompany").append(
              "<option value=" +
                data.Data[i]._id +
                ">" +
                data.Data[i].Name +
                "</option>"
            );
          }
        }
      },
    });
  }

  function loadtiming() {
    $.ajax({
      type: "POST",
      url: $("#website-url").attr("value") + "timing",
      data: { type: "getdata" },
      dataType: "json",
      cache: false,
      success: function (data) {
        if (data.isSuccess == true) {
          $("#timing").html("");
          TIMING = data.Data[0]._id;
          for (i = 0; i < data.Data.length; i++) {
            $("#timing").append(
              "<option value=" +
                data.Data[i]._id +
                ">" +
                data.Data[i].Name +
                " - " +
                data.Data[i].StartTime +
                " - " +
                data.Data[i].EndTime +
                "</option>"
            );
          }
        }
      },
    });
  }

  function loaddata() {
    $.ajax({
      type: "POST",
      url: $("#website-url").attr("value") + "employee",
      data: { type: "getdata" },
      dataType: "json",
      cache: false,
      beforeSend: function () {
        $("#displaydata").html(
          '<tr><td colspan="5" class="text-center font-weight-bold">Loading...</td></tr></center>'
        );
      },
      success: function (data) {
        if (data.isSuccess == true) {
          $("#displaydata").html("");
          for (i = 0; i < data.Data.length; i++) {
            data.Data[i]["MailId"] =
              data.Data[i]["MailId"] == undefined
                ? "-"
                : data.Data[i]["MailId"];
            $("#displaydata").append(
              "<tr><td>" +
                data.Data[i]["Name"] +
                "</td><td>" +
                data.Data[i]["MailId"] +
                "</td><td>" +
                data.Data[i]["Mobile"] +
                "</td><td>" +
                '<a id="edit-data" href="employee.php?id=' +
                data.Data[i]["_id"] +
                '"><i class="fas fa-edit" aria-hidden="true"></i></a>' +
                "</td><td>" +
                "<a href=singleemployee.php?id=" +
                data.Data[i]["_id"] +
                ">View More</a></td></tr>"
            );
          }
        } else {
          $("#displaydata").html(
            '<tr><td colspan="4" class="text-center font-weight-bold">No Records Found.</td></tr></center>'
          );
        }
      },
    });
  }

  $(document).on("click", "#edit-data", function (e) {
    e.preventDefault();
    var id = $(this).attr("href").split("=")[1];
    $.ajax({
      type: "POST",
      url: $("#website-url").attr("value") + "employee",
      data: { type: "getemployee", id: id },
      dataType: "json",
      cache: false,
      success: function (data) {
        if (data.isSuccess == true) {
          UPDATEID = id;
          time =
            data.Data[0].Timing == undefined ? TIMING : data.Data[0].Timing;
          $("#firstname").val(data.Data[0].FirstName);
          $("#middlename").val(data.Data[0].MiddleName);
          $("#lastname").val(data.Data[0].LastName);
          $("#gender").val(data.Data[0].Gender);
          $("#dob").val(dob);
          $("#mobile").val(data.Data[0].Mobile);
          $("#mail").val(data.Data[0].Mail);
          $("#married").val(data.Data[0].MartialStatus);
          $("#joindate").val(joindate);
          $("#subcompany").val(data.Data[0].SubCompany);
          $("#confirmationdate").val(confirmationdate);
          $("#terminationdate").val(data.Data[0].terminationdate);
          $("#prohibition").val(data.Data[0].Prohibition);
          $("#department").val(data.Data[0].Department);
          $("#designation").val(data.Data[0].Designation);
          $("#idtype").val(data.Data[0].IDtype);
          $("#idnumber").val(data.Data[0].IDNumber);
          $("#timing").val(time);
          window.scrollTo(0, 0);
          $("#btn-submit-on").html(
            "<button type='submit' class='btn btn-success' id='btn-update'>Update</button>" +
              "<button type='submit' class='btn btn-danger ml-2' id='btn-cancel'>Cancel</button>"
          );
        }
      },
    });
  });

  $(document).on("click", "#btn-cancel", function (e) {
    e.preventDefault();
    $("form")[0].reset();
    $("#btn-submit-on").html(
      "<button type='submit' class='btn btn-success' id='btn-submit'>Submit</button>" +
        "<button type='submit' class='btn btn-danger ml-2' id='btn-cancel'>Cancel</button>"
    );
  });

  $(document).on("click", "#btn-update", function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: $("#website-url").attr("value") + "employee",
      data: {
        type: "update",
        id: UPDATEID,
        firstname: $("#firstname").val(),
        middlename: $("#middlename").val(),
        lastname: $("#lastname").val(),
        gender: $("#gender").val(),
        dob: $("#dob").val(),
        mobile: $("#mobile").val(),
        mail: $("#mail").val(),
        martialstatus: $("#married").val(),
        joindate: $("#joindate").val(),
        subcompany: $("#subcompany").val(),
        confirmationdate: $("#confirmationdate").val(),
        terminationdate: $("#terminationdate").val(),
        prohibition: $("#prohibition").val(),
        department: $("#department").val(),
        designation: $("#designation").val(),
        idtype: $("#idtype").val(),
        idnumber: $("#idnumber").val(),
        timing: $("#timing").val(),
      },
      dataType: "json",
      cache: false,
      beforeSend: function () {
        $("#btn-submit-on").html(
          '<button class="btn btn-success" type="button">\
                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>\
                                Loading...\
                                </button>'
        );
      },
      success: function (data) {
        if (data.isSuccess == true) {
          $("#staticmessage")
            .removeClass("text-success text-danger")
            .addClass("text-success font-weight-bold");
          $("#staticmessage").html(data["Message"]).fadeOut(10000);
          $.when($("#staticmessage").fadeOut()).then(function () {
            $("#staticmessage").html("");
            $("#staticmessage").removeAttr("style");
            $("#staticmessage");
          });
          loaddata();
          $("#btn-submit-on").html(
            "<button type='submit' class='btn btn-success' id='btn-submit'>Submit</button>" +
              "<button type='submit' class='btn btn-danger ml-2' id='btn-cancel'>Cancel</button>"
          );
        } else {
          $("#btn-submit-on").html(
            "<button type='submit' class='btn btn-success' id='btn-update'>Update</button>" +
              "<button type='submit' class='btn btn-danger ml-2' id='btn-cancel'>Cancel</button>"
          );
        }
      },
    });
  });

  $(document).on("click", "#btn-submit", function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: $("#website-url").attr("value") + "employee",
      data: {
        type: "insert",
        firstname: $("#firstname").val(),
        middlename: $("#middlename").val(),
        lastname: $("#lastname").val(),
        gender: $("#gender").val(),
        dob: $("#dob").val(),
        mobile: $("#mobile").val(),
        mail: $("#mail").val(),
        martialstatus: $("#married").val(),
        joindate: $("#joindate").val(),
        subcompany: $("#subcompany").val(),
        confirmationdate: $("#confirmationdate").val(),
        terminationdate: $("#terminationdate").val(),
        prohibition: $("#prohibition").val(),
        department: $("#department").val(),
        designation: $("#designation").val(),
        idtype: $("#idtype").val(),
        idnumber: $("#idnumber").val(),
        timing: $("#timing").val(),
      },
      dataType: "json",
      cache: false,
      beforeSend: function () {
        $("#btn-submit-on").html(
          '<button class="btn btn-success" type="button">\
                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>\
                                Loading...\
                                </button>'
        );
      },
      success: function (data) {
        if (data.isSuccess == true) {
          $("#staticmessage")
            .removeClass("text-success text-danger")
            .addClass("text-success font-weight-bold");
          $("#staticmessage").html(data["Message"]).fadeOut(10000);
          $.when($("#staticmessage").fadeOut()).then(function () {
            $("#staticmessage").html("");
            $("#staticmessage").removeAttr("style");
            $("#staticmessage");
          });
          loaddata();
        }
      },
      complete: function () {
        $("#btn-submit-on").html(
          "<button type='submit' class='btn btn-success' id='btn-submit'>Submit</button>" +
            "<button type='submit' class='btn btn-danger ml-2' id='btn-cancel'>Cancel</button>"
        );
      },
    });
  });
});
