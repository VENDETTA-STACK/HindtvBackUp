$(document).ready(function () {
  var id = $(location).attr("href").split("=")[1];
  if (id != undefined) {
    $.ajax({
      type: "POST",
      url: $("#website-url").attr("value") + "employee",
      data: { type: "getsingledata", id: id },
      dataType: "json",
      cache: false,
      success: function (data) {
        if (data.isSuccess === true) {
          $("#displaydata").html(
            "<tr><td>Name</td><td>" +
              data.Data[0]["Name"] +
              "</td></tr><td>First Name</td><td>" +
              data.Data[0]["FirstName"] +
              "</td></tr><tr><td>Last Name</td><td>" +
              data.Data[0]["LastName"] +
              "</td></tr><tr><td>DOB</td><td>" +
              data.Data[0]["DOB"] +
              "</td><tr><td>Gender</td><td>" +
              data.Data[0]["Gender"] +
              "</td></tr><tr><td>Mobile</td><td>" +
              data.Data[0]["Mobile"] +
              "</td></tr></td></tr><tr><td>Email</td><td>" +
              data.Data[0]["MailId"] +
              "</td></tr><tr><td>Confirmation Date</td><td>" +
              data.Data[0]["ConfirmationDate"] +
              "</td></tr><tr><td>Join Date</td><td>" +
              data.Data[0]["JoinDate"] +
              "</td></tr><tr><td>Termination Date</td><td>" +
              data.Data[0]["TerminationDate"] +
              "</td></tr><tr><td>Prohibition(Months)</td><td>" +
              data.Data[0]["Prohibition"] +
              "</td></tr>"
          );
        } else {
          alert("No id found");
        }
      },
    });
  } else {
    alert("Invalid Id");
  }
});
