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
                <h1 class="m-0 text-dark">Timing Details</h1>
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
            <div class="row">
              <div class="col-lg-12">
                <div class="card card-success">
                  <div class="card-header">
                    <h3 class="card-title">Add Shift Times</h3>
                  </div>
                  <form role="form">
                    <div class="card-body row">
                      <div class="form-group col-md-3">
                        <label for="name">Name</label>
                        <input
                          type="text"
                          class="form-control"
                          id="name"
                          name="name"
                          placeholder="Name"
                        />
                      </div>
                      <div class="form-group col-md-3">
                        <label for="sst">Shift Start Time</label>
                        <input
                          type="text"
                          class="form-control"
                          id="sst"
                          name="sst"
                          placeholder="Shift Start Time"
                        />
                      </div>
                      <div class="form-group col-md-3">
                        <label for="set">Shift End Time</label>
                        <input
                          type="text"
                          class="form-control"
                          id="set"
                          name="set"
                          placeholder="Shift End Time"
                        />
                      </div>                                   
                    </div>
                    <!-- /.card-body -->
                    <center>
                      <div class="form-check" id="staticmessage"></div>
                    </center>
                    <div class="card-footer" id="btn-submit-on">
                      <button
                        type="submit"
                        class="btn btn-success"
                        id="btn-submit"
                      >
                        Submit
                      </button>
                      <button
                        type="submit"
                        class="btn btn-danger ml-1"
                        id="btn-cancel"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <!-- /.col-md-6 -->
            </div>
            <!-- /.row -->
          </div>
          <!-- /.container-fluid -->
          <div class="container-fluid">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Display Data</h3>
              </div>
              <!-- /.card-header -->
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody id="displaydata"></tbody>
              </table>
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
    <script src="js/timing.js"></script>
  </body>
</html>
