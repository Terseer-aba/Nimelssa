<?php 
session_start();
if (isset($_SESSION["user"])) {
    header("location: index.php");
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>registration form</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">
</head>
<body>
 <center> <h1>REGISTRATION FORM</h1></center>
    <div class="container">
        <?php
        if (isset($_POST["submit"])){
            $fullName = $_POST["fullname"];
            $email = $_POST["email"];
            $password = $_POST["password"];
            $passwordRepeat = $_POST["repeat_password"];
        
            /* inscript password(hash password)*/
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);


            /* for validation of any empty field*/
            $errors = array();
            if (empty($fullName) OR empty($email) OR empty($password) OR empty($passwordRepeat)){
                array_push( $errors,"All fields are required");
            }

          /* for validation of email*/
          if (!filter_var($email,FILTER_VALIDATE_EMAIL)){
            array_push($errors,"Email is not valid");
          }
          /* for validation of password*/
          if(strlen($password)<8){
            array_push($errors,"Password should be at least 8 characters long");
          }
          /* check if the user provide different password in the repeat password field*/
          if($password!==$passwordRepeat){
            array_push($errors,"password does not match");
          }
         //check if the email already exist
         require_once  "database.php";
         $sql = "SELECT * FROM users WHERE email = '$email'";
         $result = mysqli_query($conn,$sql);
         $rowCount = mysqli_num_rows($result);
         if($rowCount>0) {
          array_push($errors, "Email already exist!");
         }

          /**to check if there is error */
          if(count($errors)>0) {
            foreach ($errors as $error) {
               echo "<div class= 'alert alert-danger'> $error</div>";
            }
          }else{
            //we will insert the data into database
        
        // the users, full_name email and oassword are info from myadmin. users is the table name 
        $sql = "INSERT INTO users (full_name, email, password) VALUES ( ?, ?, ? )";
        $stmt = mysqli_stmt_init($conn);
        $prepareStmt = mysqli_stmt_prepare($stmt,$sql);
        if ($prepareStmt) {
          //bind the variable(fullName, email, passwordHash)
          mysqli_stmt_bind_param($stmt,"sss",$fullName, $email, $passwordHash);
          //execute it
          mysqli_stmt_execute($stmt);
          // if it is successfully executed alert the user message
          echo "<div class='alert alert-success'>You are registered successfully.</div>";

        }else{
          die("something went wrong");
        }
          }
        }
        ?>
        <form action="registration.php" method="post">
            <div class="form-group">
                <input type="text" class="form-control" name="fullname" placeholder="full name">
            </div>
            <div class="form-group">
                <input type="email" class="form-control" name="email" placeholder="enter email">
            </div>
            <div class="form-group">
                <input type="text" class="form-control" name="institution" placeholder="enter your institution">
            </div>
            <div class="form-group">
                <input type="tel" class="form-control" name="tel" placeholder="enter your phone number">
            </div>
            <div class="form-group">
                <input type="email" class="form-control" name="email" placeholder="enter email">
            </div>
            <div class="form-group">
                <input type="password" class="form-control" name="password" placeholder="enter password">
            </div>
            <div class="form-group">
                <input type="password" class="form-control" name="repeat_password" placeholder="repeat password">
            </div>
            <div class="form-btn">
                <input type="submit" class="btn btn-primary" value="Register" name="submit">
            </div>
        </form>
        <div><p>Already registered<a href="login.php">Login Here</a></p></div>
     </div>
</body>
</html>