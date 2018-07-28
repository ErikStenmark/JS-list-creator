<?php 
include 'loginconfig.php';

if (isset($_SESSION['logged_in_listapp']) && $_SESSION['logged_in_listapp'] == true) {
	header ('location: ../index.php');
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') 
{
    if (isset($_POST['login'])) { //user logging in
        require 'login.php';    
    }	
}
include '../inc/head.php';
?>
<body>
	<div class="login">
		<form action="index.php" id="loginform" method="post" autocomplete="off">		  
		<input type="hidden" name="client" value="web">
			<div class="input">
			<div class="field-wrap">
				<label>
				Email / username:
				</label>
				<input type="text" required autocomplete="on" name="logname"/>
			</div>
			<div class="field-wrap">
				<label>
				  Password:
				</label>
			<input type="password" required autocomplete="current-password" name="password"/>
		  </div>		  
		  </div>
		<button type="submit" name="login">Log in</button>
		</form>
	</div>
</body>
</html>
