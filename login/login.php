<?php

$name = filter_input(INPUT_POST,'logname',FILTER_SANITIZE_STRING);

$result = $login->logIn($name, $_POST['password']);
if ($result[0] == true) {
	
	$user = $result[1];	

			//This is how we'll know the user is logged in
			$_SESSION['logged_in'] = true;

			$_SESSION['email'] = $user['email'];
			$_SESSION['username'] = $user['username'];
			$_SESSION['first_name'] = $user['first_name'];
			$_SESSION['last_name'] = $user['last_name'];
			$_SESSION['id'] = $user['id'];
			
			header("location: index.php");

} else {
	
	if($result[1] == "notfound") {
		$_SESSION['message'] = 'User not found';
	} 
	else if($result[1] == "password") {
		$_SESSION['message'] = 'Wrong password';
	} 
	else {
		$_SESSION['message'] = 'Error!';
	}
	header("location: error.php");
}