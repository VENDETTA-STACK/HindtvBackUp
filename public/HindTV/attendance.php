<!DOCTYPE html>
<html lang="en">
  <?php include('header.php'); ?>
  <body class="hold-transition sidebar-mini">
    <div class="wrapper">      
    <?php include('navbar.php'); ?>
      <!-- Content Wrapper. Contains page content -->
      <div class="content-wrapper">
        <!-- Content Header (Page header) -->
        <div class="content-header">
          <div class="container-fluid">
            <div class="row mb-2">
              <div class="col-sm-6">
                <h1 class="m-0 text-dark">Attendance Details</h1>
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
          <div class="container-fluid">
            <div class="card card-danger" style="display:none;">
              <div class="card-header">
                <h3 class="card-title">Filter Data</h3>
              </div>
              <div class="card-body">
                <div class="row">
                <div class="col-3">
                    <label>Day Filter</label>
                    <select class="form-control" id="day-filter">
                    <option value="All">All</option>
                      <option value="Monday">Sunday</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                    </select>
                  </div>
                <div class="col-3">
                    <label>Date Filter</label>                    
                    <input type="date" class="form-control" id="startdate" name="startdate">                    
                    <input type="date" class="form-control mt-1" id="enddate" name="enddate">
                  </div>
                  <div class="col-3">
                    <label>Area Filter</label>
                    <select class="form-control" id="area-filter">                      
                    </select>
                  </div>
                  <div class="col-3">
                    <label>Status Filter</label>
                    <select class="form-control" id="status-filter">
                      <option value="0">All</option>
                      <option value="1">In</option>
                      <option value="2">Out</option>
                    </select>
                  </div>         
                </div>
              </div>
              <div class="card-footer">
              <button type="submit" class="btn btn-success"id="btn-apply-filter">Apply Filter</button>
                <button type="submit" class="btn btn-danger"id="btn-remove-filter">Remove All Filter</button>
              </div>
              <!-- /.card-body -->
            </div>
          </div>
          <div class="container-fluid">
            <div class="card">
              <div class="card-header">                
              </div>
              <!-- /.card-header -->
              <div class="card-body">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Mobile</th>
                      <th>Day</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>View Image</th>
                      <th>Area of Attendance</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody id="displaydata"></tbody>
                </table>
              </div>
              <!-- /.card-body -->
            </div>
          </div>
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
    <script src="js/attendance.js"></script>
  </body>
</html>
