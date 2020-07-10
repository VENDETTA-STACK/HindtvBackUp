$(document).ready(function () {
  loaddata();

  var UPDATEID;

  function loaddata() {
    $.ajax({
      type: "POST",
      url: $("#website-url").attr("value") + "company",
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
            data.Data[i]["ContactPersonName"] =
              data.Data[i]["ContactPersonName"] == undefined
                ? "-"
                : data.Data[i]["ContactPersonName"];
            data.Data[i]["ContactPersonNumber"] =
              data.Data[i]["ContactPersonNumber"] == undefined
                ? "-"
                : data.Data[i]["ContactPersonNumber"];
            $("#displaydata").append(
              "<tr><td>" +
                data.Data[i]["Name"] +
                "</td><td>" +
                data.Data[i]["Address"] +
                "</td><td>" +
                data.Data[i]["ContactPersonName"] +
                "</td><td>" +
                data.Data[i]["ContactPersonNumber"] +
                "</td><td>" +
                "<a id='edit-data' href='company.php?id=" +
                data.Data[i]["_id"] +
                "'><i class='fas fa-edit' aria-hidden='true'></i></a>" +
                "</td></tr>"
            );
          }
        } else {
          $("#displaydata").html(
            '<tr><td colspan="5" class="text-center font-weight-bold">No Records Found.</td></tr></center>'
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
      url: $("#website-url").attr("value") + "company",
      data: { type: "getcompany", id: id },
      dataType: "json",
      cache: false,
      success: function (data) {
        if (data.isSuccess == true) {
          UPDATEID = data.Data[0]._id;
          $("#companyname").val(data.Data[0].Name);
          $("#companyaddress").val(data.Data[0].Address);
          $("#ccpn").val(data.Data[0].ContactPersonName);
          $("#cpn").val(data.Data[0].ContactPersonNumber);
          $("#email").val(data.Data[0].Email);
          $("#gstin").val(data.Data[0].GSTIN);
          $("#btn-submit-on").html(
            '<button type="submit" class="btn btn-success" id="btn-update">Update</button>' +
              '<button type="submit" class="btn btn-danger ml-1" id="btn-cancel">Cancel</button>'
          );
        }
      },
    });
  });

  $(document).on("click", "#btn-cancel", function (e) {
    UPDATEID = undefined;
    $("form")[0].reset();
    $("#btn-submit-on").html(
      '<button type="submit" class="btn btn-success" id="btn-submit">Submit</button>' +
        '<button type="submit" class="btn btn-danger ml-1" id="btn-cancel">Cancel</button>'
    );
  });

  $(document).on("click", "#btn-update", function (e) {
    e.preventDefault();
    if (UPDATEID != undefined) {
      $.ajax({
        type: "POST",
        url: $("#website-url").attr("value") + "company",
        data: {
          type: "update",
          id: UPDATEID,
          name: $("#companyname").val(),
          address: $("#companyaddress").val(),
          contactpersonname: $("#ccpn").val(),
          contactpersonnumber: $("#cpn").val(),
          Email: $("#email").val(),
          GSTIN: $("#gstin").val(),
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
            $("form")[0].reset();
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
              '<button type="submit" class="btn btn-success" id="btn-submit">Submit</button>' +
                '<button type="submit" class="btn btn-danger ml-1" id="btn-cancel">Cancel</button>'
            );
          } else {
            $("#btn-submit-on").html(
              '<button type="submit" class="btn btn-success" id="btn-update">Update</button>' +
                '<button type="submit" class="btn btn-danger ml-1" id="btn-cancel">Cancel</button>'
            );
          }
        },
      });
    }
  });

  $(document).on("click", "#btn-submit", function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: $("#website-url").attr("value") + "company",
      data: {
        type: "insert",
        name: $("#companyname").val(),
        address: $("#companyaddress").val(),
        contactpersonname: $("#ccpn").val(),
        contactpersonnumber: $("#cpn").val(),
        Email: $("#email").val(),
        gstin: $("#gstin").val(),
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
          $("form")[0].reset();
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
          '<button type="submit" class="btn btn-success" id="btn-submit">Submit</button>' +
            '<button type="submit" class="btn btn-danger ml-1" id="btn-cancel">Cancel</button>'
        );
      },
    });
  });
});
