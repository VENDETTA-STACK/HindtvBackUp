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
                <h1 class="m-0 text-dark">Employee Details</h1>
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
                    <h3 class="card-title">Add Employee</h3>
                  </div>
                  <form role="form">
                    <div class="card-body row">
                      <div class="form-group col-md-3">
                        <label for="firstname">First Name</label>
                        <input
                          type="text"
                          class="form-control"
                          id="firstname"
                          name="firstname"
                          placeholder="First Name"
                        />
                        <label id="errorFirstName" class="text-danger"></label>
                      </div>                      
                      <div class="form-group col-md-3">
                        <label for="lastname">Middle Name</label>
                        <input
                          type="text"
                          class="form-control"
                          id="middlename"
                          name="middlename"
                          placeholder="Middle Name"
                        />
                        <label id="errorMiddleName"></label>
                      </div>                      
                      <div class="form-group col-md-3">
                        <label for="lastname">Last Name</label>
                        <input
                          type="text"
                          class="form-control"
                          id="lastname"
                          name="lastname"
                          placeholder="Last Name"
                        />
                        <label id="errorLastName"></label>
                      </div>                      
                      <div class="form-group col-md-3">
                        <label for="gender">Gender</label>
                        <div class="input-group">
                          <div class="custom-file">
                            <select
                              class="form-control"
                              id="gender"
                              name="gender"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                          </div>
                        </div>
                        <label id="errorGender"></label>
                      </div>                      
                      <div class="form-group col-md-3">
                        <label for="dob">DOB</label>
                        <div class="input-group">
                          <div class="custom-file">
                            <input
                              type="text"
                              class="form-control"
                              id="dob"
                              name="dob"
                              placeholder = "DOB"
                            />
                          </div>
                        </div>
                        <label id="errorDOB"></label>
                      </div>                      
                      <div class="form-group col-md-3">
                        <label for="mobile">Mobile Number</label>
                        <div class="input-group">
                          <div class="custom-file">
                            <input
                              type="text"
                              class="form-control"
                              id="mobile"
                              name="mobile"
                              placeholder="Mobile"
                            />
                          </div>
                        </div>
                        <label id="errorMobile" class="text-danger"></label>
                      </div>                      
                      <div class="form-group col-md-3">
                        <label for="mail">Mail</label>
                        <div class="input-group">
                          <div class="custom-file">
                            <input
                              type="text"
                              class="form-control"
                              id="mail"
                              name="mail"
                              placeholder="Mail Id"
                            />
                          </div>
                        </div>
                        <label id="errorMail"></label>
                      </div>                      
                      <div class="form-group col-md-3">
                        <label for="married">Maritial Status</label>
                        <div class="input-group">
                          <div class="custom-file">
                            <select
                              class="form-control"
                              id="married"
                              name="married"
                            >
                              <option value="Single">Single</option>
                              <option value="Married">Married</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div class="form-group col-md-3">
                        <label for="joindate">Join Date</label>
                        <div class="input-group">
                          <div class="custom-file">
                            <input
                              type="text"
                              class="form-control"
                              id="joindate"
                              name="joindate"
                              placeholder = "Join Date"
                            />
                          </div>
                        </div>
                        <label id="errorJoinDate"></label>
                      </div>                      
                      <div class="form-group col-md-3">
                        <label for="confirmationdate">Confirmation Date</label>
                        <div class="input-group">
                          <div class="custom-file">
                            <input
                              type="text"
                              class="form-control"
                              id="confirmationdate"
                              name="confirmationdate"
                              placeholder = "Confirmation Date"
                            />
                          </div>
                        </div>
                        <label id="errorConfirmationDate"></label>
                      </div>                      
                      <div class="form-group col-md-3">
                        <label for="terminationdate">Termination Date</label>
                        <div class="input-group">
                          <div class="custom-file">
                            <input
                              type="text"
                              class="form-control"
                              id="terminationdate"
                              name="terminationdate"
                              placeholder = "Termination Date"
                            />
                          </div>
                        </div>
                        <label id="errorTerminationDate"></label>
                      </div>                      
                      <div class="form-group col-md-3">
                        <label for="prohibition">Prohibition</label>
                        <input
                          type="text"
                          class="form-control"
                          id="prohibition"
                          name="prohibition"
                          placeholder="Prohibition Period(Months)"
                        />
                      </div>
                      <label id="Prohibition"></label>
                      <div class="form-group col-md-3">
                        <label for="subcompany">Sub Company</label>
                        <div class="input-group">
                          <select
                            class="form-control"
                            id="subcompany"
                            name="subcompany"
                          ></select>
                        </div>
                      </div>
                      <div class="form-group col-md-3">
                        <label for="department">Department</label>
                        <div class="input-group">
                          <div class="custom-file">
                            <input
                              type="text"
                              class="form-control"
                              id="department"
                              name="department"
                              placeholder="Department"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="form-group col-md-3">
                        <label for="designation">Designation</label>
                        <div class="input-group">
                          <div class="custom-file">
                            <input
                              type="text"
                              class="form-control"
                              id="designation"
                              name="designation"
                              placeholder="Designation"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="form-group col-md-3">
                        <label for="idtype">ID Type</label>
                        <div class="input-group">
                          <div class="custom-file">
                            <input
                              type="text"
                              class="form-control"
                              id="idtype"
                              name="idtype"
                              placeholder="ID Type"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="form-group col-md-3">
                        <label for="idnumber">ID Number</label>
                        <div class="input-group">
                          <div class="custom-file">
                            <input
                              type="text"
                              class="form-control"
                              id="idnumber"
                              name="idnumber"
                              placeholder="ID Number"
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
                        class="btn btn-danger ml-2"
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
                    <th>Mail</th>
                    <th>Mobile</th>
                    <th>Action</th>
                    <th>View More</th>                    
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
    <script src="js/employee.js"></script>
  </body>
</html>
