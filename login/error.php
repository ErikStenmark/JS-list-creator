<?php
include 'loginconfig.php';
$pageTitle = 'Login error';

if( isset($_SESSION['message']) AND !empty($_SESSION['message']) ) {
	$sessionMessage = $_SESSION['message'];
	unset($_SESSION['message']);
} else {
	header( "location: index.php" );
}
?>
<body id="loginbody">
	<div id="logcontainer">
		<div class="logform">  
			<h1><?php echo 'error logging in' ?></h1>
			<p>

			<?php echo $sessionMessage ?>
			
			</p>     
			<a href="index.php">
			<button class="logbutton"/><?php echo 'back'; ?></button>
			</a>
		</div>
	</div>
</body>
</html>
