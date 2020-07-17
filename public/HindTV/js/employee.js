$(document).ready(function () {
  loaddata();
  loadsubcompany();
  var UPDATEID;  
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
          $("#firstname").val(data.Data[0].FirstName);
          $("#middlename").val(data.Data[0].MiddleName);
          $("#lastname").val(data.Data[0].LastName);
          $("#gender").val(data.Data[0].Gender);
          $("#dob").val(data.Data[0].DOB);
          $("#mobile").val(data.Data[0].Mobile);
          $("#mail").val(data.Data[0].Mail);
          $("#married").val(data.Data[0].MartialStatus);
          $("#joindate").val(data.Data[0].JoinDate);
          $("#subcompany").val(data.Data[0].SubCompany);
          $("#confirmationdate").val(data.Data[0].ConfirmationDate);
          $("#terminationdate").val(data.Data[0].TerminationDate);
          $("#prohibition").val(data.Data[0].Prohibition);
          $("#department").val(data.Data[0].Department);
          $("#designation").val(data.Data[0].Designation);
          $("#idtype").val(data.Data[0].IDtype);
          $("#idnumber").val(data.Data[0].IDNumber);
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
    $("#errorFirstName").html("");
    $("#errorMobile").html("");
    $("#btn-submit-on").html(
      "<button type='submit' class='btn btn-success' id='btn-submit'>Submit</button>" +
        "<button type='submit' class='btn btn-danger ml-2' id='btn-cancel'>Cancel</button>"
    );
  });

  $(document).on("click", "#btn-update", function (e) {
    e.preventDefault();
    val = validation();
    if (val == 1) {
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
            $("form")[0].reset();
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
    }
  });

  $(document).on("click", "#btn-submit", function (e) {
    e.preventDefault();
    val = validation();
    if (val == 1) {
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
            $("form")[0].reset();
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
    }
  });

  function validation() {
    val = 1;
    $("#errorFirstName").html("");
    if ($("#firstname").val() == "") {
      $("#errorFirstName").html("First Name can't be empty");
      val = 0;
    }
    $("#errorMobile").html("");
    if ($("#mobile").val() != "") {
      var preg = /^[789]\d{9}$/;
      if (!$("#mobile").val().match(preg)) {
        $("#errorMobile").html("Invalid Mobile No.");
        val = 0;
      }
    } else {
      $("#errorMobile").html("Mobile Number can't be empty");
      val = 0;
    }
    return val;
  }
});
