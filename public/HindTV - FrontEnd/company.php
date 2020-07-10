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
                <h1 class="m-0 text-dark">Company Details</h1>
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
                    <h3 class="card-title">Add Company</h3>
                  </div>
                  <form role="form">
                    <div class="card-body row">
                      <div class="form-group col-md-3">
                        <label for="companyname">Company Name</label>
                        <input
                          type="email"
                          class="form-control"
                          id="companyname"
                          name="companyname"
                          placeholder="Company Name"
                        />
                      </div>
                      <div class="form-group col-md-3">
                        <label for="companyaddress">Company Address</label>
                        <input
                          type="text"
                          class="form-control"
                          id="companyaddress"
                          name="companyaddress"
                          placeholder="Company Address"
                        />
                      </div>
                      <div class="form-group col-md-3">
                        <label for="ccpn">Contact Person Name</label>
                        <input
                          type="text"
                          class="form-control"
                          id="ccpn"
                          name="ccpn"
                          placeholder="Contact Person Name"
                        />
                      </div>
                      <div class="form-group col-md-3">
                        <label for="ccpn">Contact Person Number</label>
                        <div class="input-group">
                          <div class="custom-file">
                            <input
                              type="text"
                              class="form-control"
                              id="cpn"
                              name="cpn"
                              placeholder="Contact Person Number"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="form-group col-md-3">
                        <label for="email">Email</label>
                        <div class="input-group">
                          <div class="custom-file">
                            <input
                              type="text"
                              class="form-control"
                              id="email"
                              name="email"
                              placeholder="Email"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="form-group col-md-3">
                        <label for="gstin">GSTIN</label>
                        <div class="input-group">
                          <div class="custom-file">
                            <input
                              type="text"
                              class="form-control"
                              id="gstin"
                              name="gstin"
                              placeholder="GSTIN"
                            />
                          </div>
                        </div>
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
                        class="btn btn-danger"
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
                    <th>Company Name</th>
                    <th>Company Address</th>
                    <th>Contact Person Name</th>
                    <th>Contact Person Number</th>
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
    <script src="js/company.js"></script>
  </body>
</html>
