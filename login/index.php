<?php 
include 'loginconfig.php';

if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {
	header ('location: ../index.php');
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') 
{
    if (isset($_POST['login'])) { //user logging in
        require 'login.php';    
    }	
}
?>

<body>
	<div>
		<h1>Welcome</h1>
		<form action="index.php" id="loginform" method="post" autocomplete="off">		  
		<input type="hidden" name="client" value="web">
			<div class="input">
			<div class="field-wrap">
				<label>
				Email / username:
				</label><br>
				<input type="text" required autocomplete="off" name="logname"/>
			</div>
			<div class="field-wrap">
				<label>
				  Password:
				</label><br>
			<input type="password" required autocomplete="off" name="password"/>
		  </div>		  
		  </div>
		<button type="submit" name="login">Log in</button>
		</form>
	</div>
</body>
</html>
