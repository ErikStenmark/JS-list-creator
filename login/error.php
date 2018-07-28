<?php
include 'loginconfig.php';
$pageTitle = 'Login error';

if( isset($_SESSION['message']) AND !empty($_SESSION['message']) ) {
	$sessionMessage = $_SESSION['message'];
	unset($_SESSION['message']);
} else {
	header( "location: index.php" );
}
include '../inc/head.php';
?>
<body>
  <div class="login">
    <h1><?php echo 'error logging in' ?></h1>
    <p><?php echo $sessionMessage ?></p>     
    <a href="index.php">
      <button class="logbutton"/><?php echo 'back'; ?></button>
    </a>
  </div>
</body>
</html>
