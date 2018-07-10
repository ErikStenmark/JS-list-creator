<?php

$line = date('Y-m-d H:i:s') . " - $_SERVER[REMOTE_ADDR]";
$name = filter_input(INPUT_POST,'logname',FILTER_SANITIZE_STRING);
$client = filter_input(INPUT_POST,'client',FILTER_SANITIZE_STRING);

$result = $login->logIn($name, $_POST['password']);
if ($result[0] == true) {
	
	$user = $result[1];	
	
	if ($client == 'web') {	

			//This is how we'll know the user is logged in
			$_SESSION['logged_in'] = true;

			$_SESSION['email'] = $user['email'];
			$_SESSION['username'] = $user['username'];
			$_SESSION['first_name'] = $user['first_name'];
			$_SESSION['last_name'] = $user['last_name'];
			$_SESSION['id'] = $user['id'];
			
			header("location: index.php");
		}
		
		if ($client == 'app') {
			$mStatus = 'ok';
		}
	
} else {
	
	if($result[1] == "notfound") {
		$_SESSION['message'] = $ln_usrn_email_not_f;
		$mStatus = 'usrn';
		file_put_contents('../inc/log/visitors.log', $line . ' failed login attempt (username: '.$name.') on '. $client . PHP_EOL, FILE_APPEND);
		header("location: error.php");
	} 
	else if($result[1] == "password") {
		$_SESSION['message'] = $ln_wrong_psw;
		$mStatus = 'psw';
		file_put_contents('../inc/log/visitors.log', $line . ' wrong password for '.$name.' on '. $client . PHP_EOL, FILE_APPEND);
        header("location: error.php");
	} 
	else {
		$_SESSION['message'] = $ln_error;
		header("location: error.php");
	}
}

if ($client == 'app' && $mStatus == 'ok') {
	echo json_encode(array(
		"response" => $mStatus,
		"email" => $user['email'],
		"username" => $user['username'],
		"type" => $user['type'],
		"first_name" => $user['first_name'],
		"last_name" => $user['last_name'],
		"active" => $user['active'],
		"id" => $user['id']
		));
		file_put_contents('../inc/log/visitors.log', $line .' '. $user['username'] .' login on Android'. PHP_EOL, FILE_APPEND);			
}

if ($client == 'app' && $mStatus != 'ok') {
	echo json_encode(array("response" => $mStatus));
}