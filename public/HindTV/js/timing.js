$(document).ready(function () {
  loaddata();
  var UPDATEID;

  function loaddata() {
    $.ajax({
      type: "POST",
      url: $("#website-url").attr("value") + "timing",
      data: { type: "getdata" },
      dataType: "json",
      cache: false,
      beforeSend: function () {
        $("#displaydata").html(
          '<tr><td colspan="4" class="text-center font-weight-bold">Loading...</td></tr></center>'
        );
      },
      success: function (data) {
        if (data.isSuccess == true) {
          $("#displaydata").html("");
          for (i = 0; i < data.Data.length; i++) {
            $("#displaydata").append(
              "<tr><td>" +
                data.Data[i]["Name"] +
                "</td><td>" +
                data.Data[i]["StartTime"] +
                "</td><td>" +
                data.Data[i]["EndTime"] +
                "</td><td>" +
                "<a id=edit-time href=timing.php?id=" +
                data.Data[i]._id +
                "><i class='fas fa-edit' aria-hidden='true'></i></a>" +
                "</td></tr>"
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

  $(document).on("click", "#edit-time", function (e) {
    e.preventDefault();
    var id = $(this).attr("href").split("=")[1];
    $.ajax({
      type: "POST",
      url: $("#website-url").attr("value") + "timing",
      data: { type: "getsingletimedata", id: id },
      dataType: "json",
      cache: false,
      success: function (data) {
        if (data.isSuccess == true) {
          UPDATEID = id;
          $("#name").val(data.Data[0].Name);
          $("#sst").val(data.Data[0].StartTime);
          $("#set").val(data.Data[0].EndTime);
          $("#btn-submit-on").html(
            '<button type="submit" class="btn btn-success" id="btn-update">Update</button>' +
              "<button type='submit' class='btn btn-danger ml-1' id='btn-cancel'>Cancel</button>"
          );
        }
      },
    });
  });

  $(document).on("click", "#btn-update", function (e) {
    e.preventDefault();
    if (UPDATEID != undefined) {
      val = validation();
      if (val == 1) {
        $.ajax({
          type: "POST",
          url: $("#website-url").attr("value") + "timing",
          data: {
            type: "update",
            id: UPDATEID,
            name: $("#name").val(),
            st: $("#sst").val(),
            et: $("#set").val(),
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
                '<button type="submit" class="btn btn-success" id="btn-submit">Submit</button>' +
                  "<button type='submit' class='btn btn-danger ml-1' id='btn-cancel'>Cancel</button>"
              );
            } else {
              $("#btn-submit-on").html(
                '<button type="submit" class="btn btn-success" id="btn-update">Update</button>' +
                  "<button type='submit' class='btn btn-danger ml-1' id='btn-cancel'>Cancel</button>"
              );
            }
          },
        });
      }
    }
  });

  $(document).on("click", "#btn-cancel", function (e) {
    e.preventDefault();
    $("form")[0].reset();
    $("#errorName").html("");
    $("#errorSST").html("");
    $("#errorSET").html("");
    $("#btn-submit-on").html(
      '<button type="submit" class="btn btn-success" id="btn-submit">Submit</button>' +
        "<button type='submit' class='btn btn-danger ml-1' id='btn-cancel'>Cancel</button>"
    );
  });

  $(document).on("click", "#btn-submit", function (e) {
    e.preventDefault();
    val = validation();
    if (val == 1) {
      $.ajax({
        type: "POST",
        url: $("#website-url").attr("value") + "timing",
        data: {
          type: "insert",
          name: $("#name").val(),
          st: $("#sst").val(),
          et: $("#set").val(),
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
            '<button type="submit" class="btn btn-success" id="btn-submit">Submit</button>' +
              "<button type='submit' class='btn btn-danger ml-1' id='btn-cancel'>Cancel</button>"
          );
        },
      });
    }
  });

  function validation() {
    val = 1;
    $("#errorName").html("");
    if ($("#name").val() == "") {
      $("#errorName").html("Name can't be empty");
      val = 0;
    }
    $("#errorSST").html("");
    if ($("#sst").val() == "") {
      $("#errorSST").html("Shift Start Time can't be empty");
      val = 0;
    }
    $("#errorSET").html("");
    if ($("#set").val() == "") {
      $("#errorSET").html("Shift End Time can't be empty");
      val = 0;
    }
    return val;
  }
});
