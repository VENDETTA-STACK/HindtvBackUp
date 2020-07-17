$(document).ready(function () {
  loaddata();

  var UPDATEID;

  function loaddata() {
    $.ajax({
      type: "POST",
      url: $("#website-url").attr("value") + "thought",
      data: { type: "getalldata" },
      dataType: "json",
      cache: false,
      beforeSend: function () {
        $("#displaydata").html(
          '<tr><td colspan="3" class="text-center font-weight-bold">Loading...</td></tr></center>'
        );
      },
      success: function (data) {
        if (data.isSuccess == true) {
          $("#displaydata").html("");
          for (i = 0; i < data.Data.length; i++) {
            data.Data[i]["Status"] =
              data.Data[i]["Status"] == true
                ? '<i class="fas fa-toggle-on text-success ml-1 status-update" id=status-update-' +
                  data.Data[i]._id +
                  " data-id=" +
                  data.Data[i]._id +
                  ' data-toggle=tooltip title="Quote is unblock"></i>'
                : '<i class="fas fa-toggle-off text-danger ml-1 status-update" id=status-update-' +
                  data.Data[i]._id +
                  " data-id=" +
                  data.Data[i]._id +
                  ' data-toggle=tooltip title="Quote is block"></i>';
            $("#displaydata").append(
              "<tr><td>" +
                data.Data[i]["Quote"] +
                "</td><td>" +
                // data.Data[i]["Name"] +
                // "</td><td>" +
                data.Data[i]["Status"] +
                "</td><td>" +
                "<a id=edit-thoughts href=thoughts.php?id=" +
                data.Data[i]._id +
                "><i class='fas fa-edit' aria-hidden='true'></i></a>" +
                "</td></tr>"
            );
          }
        } else {
          $("#displaydata").html(
            '<tr><td colspan="3" class="text-center font-weight-bold">No Records Found.</td></tr></center>'
          );
        }
      },
    });
  }

  $(document).on("click", ".status-update", function (e) {
    var dataId = $(this).attr("data-id");
    if ($("#status-update-" + dataId).hasClass("fa-toggle-off")) {
      sts = 1; /*It is used for unblocking the block thought*/
    } else {
      sts = 0; /*It is used for blocking the unblock thought*/
    }
    $.ajax({
      type: "POST",
      url: $("#website-url").attr("value") + "thought",
      data: { type: "statusupdate", id: dataId, sts: sts },
      dataType: "json",
      cache: false,
      success: function (data) {
        if (data.isSuccess == true) {
          toastr.success(data.Message);
          if ($("#status-update-" + dataId).hasClass("fa-toggle-off")) {
            $("#status-update-" + dataId)
              .removeClass("fa-toggle-off text-danger")
              .addClass("fa-toggle-on text-success");
          } else {
            $("#status-update-" + dataId)
              .removeClass("fa-toggle-on text-success")
              .addClass("fa-toggle-off text-danger");
          }
        } else {
          toastr.error(data.Message);
        }
      },
    });
  });

  $(document).on("click", "#edit-thoughts", function (e) {
    e.preventDefault();
    var id = $(this).attr("href").split("=")[1];
    $.ajax({
      type: "POST",
      url: $("#website-url").attr("value") + "thought",
      data: { type: "getdata", id: id },
      dataType: "json",
      cache: false,
      success: function (data) {
        if (data.isSuccess == true) {
          UPDATEID = id;
          $("#quote").val(data.Data.Quote);
          $("#saidby").val(data.Data.Name);
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
    val = validation();
    if (val == 1) {
      $.ajax({
        type: "POST",
        url: $("#website-url").attr("value") + "thought",
        data: {
          type: "update",
          id: UPDATEID,
          quote: $("#quote").val(),
          //name: $("#saidby").val(),
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
            loaddata();
            $("form")[0].reset();
            toastr.success(data.Message);
            $("#btn-submit-on").html(
              '<button type="submit" class="btn btn-success" id="btn-submit">Submit</button>' +
                "<button type='submit' class='btn btn-danger ml-1' id='btn-cancel'>Cancel</button>"
            );
          } else {
            toastr.error(data.Message);
            $("#btn-submit-on").html(
              '<button type="submit" class="btn btn-success" id="btn-update">Update</button>' +
                "<button type='submit' class='btn btn-danger ml-1' id='btn-cancel'>Cancel</button>"
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
        url: $("#website-url").attr("value") + "thought",
        data: {
          type: "insert",
          quote: $("#quote").val(),
          //name: $("#saidby").val(),
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
            loaddata();
            $("form")[0].reset();
            toastr.success(data.Message);
          } else {
            toastr.error(data.Message);
            $("#btn-submit-on").html(
              '<button type="submit" class="btn btn-success" id="btn-submit">Submit</button>' +
                "<button type='submit' class='btn btn-danger ml-1' id='btn-cancel'>Cancel</button>"
            );
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

  $(document).on("click", "#btn-cancel", function (e) {
    e.preventDefault();
    $("#errorquote").html("");
    $("#errorsaidby").html("");
    $("form")[0].reset();
    $("#btn-submit-on").html(
      '<button type="submit" class="btn btn-success" id="btn-submit">Submit</button>' +
        "<button type='submit' class='btn btn-danger ml-1' id='btn-cancel'>Cancel</button>"
    );
  });

  function validation() {
    val = 1;
    $("#errorquote").html("");
    if ($("#quote").val() == "") {
      $("#errorquote").html("Quote can't be empty");
      val = 0;
    }
    // $("#errorsaidby").html("");
    // if ($("#saidby").val() == "") {
    //   $("#errorsaidby").html("Name can't be empty");
    //   val = 0;
    // }
    return val;
  }
});
