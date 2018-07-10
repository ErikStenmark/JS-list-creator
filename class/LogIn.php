<?php

class LogIn {
	private $db;
	
	public function __construct($db) {
		$this->db = $db;
	}
	
	public function logIn($user, $password) {
		if($this->isEmail($user)) {
			$sql = "SELECT * FROM users WHERE email = :name";
		} else {
			$sql = "SELECT * FROM users WHERE username = :name";
		}
		$stmt = $this->db->connect()->prepare($sql);
		$stmt->bindParam(':name', $user);
		$stmt->execute();
		$user = $stmt->fetch(PDO::FETCH_ASSOC);
		
		if ( $user == '' ){
			$message = "notfound";
			return array(false, $message);
		} else {
			if (password_verify($password, $user['password']) ) { 
				return array(true, $user);
			} else {
				$message = "password";
				return array(false, $message);
			}
		}
	}
	
	public function isEmail($user) {
		//If the username input string is an e-mail, return true
		if(filter_var($user, FILTER_VALIDATE_EMAIL)) {
			return true;
		} else {
			return false;
		}
	}
}

?>