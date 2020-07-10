<!DOCTYPE html>
<html lang="en">  
  <?php include('header.php'); ?>
  <body class="hold-transition sidebar-mini">
    <div class="wrapper">
    <?php include('navbar.php'); ?>
      <div class="content-wrapper">
        <!-- Content Header (Page header) -->
        <div class="content-header">
          <div class="container-fluid">
            <div class="row mb-2">
              <div class="col-sm-6">
                <h1 class="m-0 text-dark">Employee Live Location</h1>
              </div>
              <!-- /.col -->
            </div>
            <!-- /.row -->
          </div>
          <!-- /.container-fluid -->
        </div>
        <!-- /.content-header -->

        <!-- Main content -->
        <div class="content">
          <div id="map"></div>
          <script
            src="https://code.jquery.com/jquery-3.5.1.js"
            integrity="sha256-QWo7LDvxbWT2tbbQ97B53yJnYU3WhH/C8ycbRAkjPDc="
            crossorigin="anonymous"
          ></script>
          <script>
            var map;
            var marker;
            var count = 0;
            String.prototype.count = function (s1) {
              return (
                (this.length - this.replace(new RegExp(s1, "g"), "").length) /
                s1.length
              );
            };
            function initMap() {
              var myLatLng = { lat: 21.1218659, lng: 73.004384 };
              map = new google.maps.Map(document.getElementById("map"), {
                zoom: 9.92,
                center: myLatLng,
              });
              getStarted();
            }
            function getStarted() {
              $.ajax({
                type: "POST",
                url: $("#website-url").attr("value") + "location",
                dataType: "json",
                cache: false,
                success: function (data) {
                  $.each(data, function (key, value) {
                    count += count;
                    marker = new google.maps.Marker({
                      position: {
                        lat: parseFloat(value.latitude),
                        lng: parseFloat(value.longitude),
                      },
                      map: map,
                      title: key,
                    });
                  });
                },
              });
            }
            function getClean() {
              for (var i = 0; i < count; i++) {
                marker[i].setMap(null);
              }
              markers = [];
            }
            setInterval(() => {
              getClean(), getStarted();
            }, 10000);
          </script>
          <script
            async
            defer
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC55UXQ86t__gJCOoemwCkDY6qWNKLJ3hM&callback=initMap"
          ></script>
        </div>
        <!-- /.content -->
      </div>
      <!-- /.content-wrapper -->
      <!-- Main Footer -->
      <footer class="main-footer">
        All rights reserved.
      </footer>
    </div>    
    <?php include('script.php'); ?>
  </body>  
</html>
