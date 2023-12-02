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
    <title>login</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">
</head>
<body>
 <center>  <h2>LOGIN FORM</h2></center>
    <div class="container">
        <?php
        //check weather the login button is successful
         if (isset($_POST["login"])) {
         $email = $_POST["email"];
         $password = $_POST["password"];
         //to check weather the email and password exit
         require_once "database.php";//to connect to the database
         $sql = "SELECT * FROM users WHERE email = '$email'";// FROM THE DATABASE(MYADMIN)
         $result = mysqli_query($conn, $sql);
         $user = mysqli_fetch_array($result, MYSQLI_ASSOC);
         if ($user) {
        //check if password provided by the user matches the one in the database
        if (password_verify($password, $user["password"])){
            //to restrict anyhow access to dasboard
            session_start();
            $_SESSION["user"] = "yes";
            //to redirect to dashboard
            header("location: index.php");
            die();
        }else{
            echo "<div class='alert alert-danger'>password does not match</div>";
        }
         }else{
            echo "<div class='alert alert-danger'>Email does not match</div>";
         }
         }
        
        ?>
        
        <form action="login.php" method="post">
            <div class="form-group">
                <input type="email" placeholder="Enter Email" name="email" class="form-control">
            </div>

            <div class="form-group">
                <input type="password" placeholder="Enter password" name="password" class="form-control">
            </div>
            <input type="submit" value="login"name="login" class="btn btn-primary">
        </form>
        <div><p>Not registered yet<a href="registration.php">Register Here</a></p></div>
    </div>
</body>
</html>