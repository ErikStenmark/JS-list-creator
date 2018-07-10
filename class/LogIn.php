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
	
	public function forgot($email) {
		$sql = "SELECT * FROM users WHERE email = :email";
		$stmt = $this->db->connect()->prepare($sql);
		$stmt->bindParam(':email', $email, PDO::PARAM_STR);
		$stmt->execute();
		
		if ( $stmt->rowCount() == 0 ){
			return false;
		} else {
			$user = $stmt->fetch(PDO::FETCH_ASSOC);
			unset($user['password']);
			return $user;
		}
	}
	
	public function findReset($email, $hash) {
		$sql = "SELECT * FROM users WHERE email = :email AND hash = :hash";
		$stmt = $this->db->connect()->prepare($sql);
		$stmt->bindParam(':email', $email, PDO::PARAM_STR);
		$stmt->bindParam(':hash', $hash, PDO::PARAM_STR);
		$stmt->execute();
		
		if ( $stmt->rowCount() == 0 ){
			return false;
		} else {
			return true;
		}
	}
	
	public function findVerify($email, $hash) {
		$sql = "SELECT * FROM users WHERE email = :email AND hash = :hash AND active = 0";
		$stmt = $this->db->connect()->prepare($sql);
		$stmt->bindParam(':email', $email, PDO::PARAM_STR);
		$stmt->bindParam(':hash', $hash, PDO::PARAM_STR);
		$stmt->execute();
		
		if ( $stmt->rowCount() == 0 ){
			return false;
		} else {
			return true;
		}
	}
	
	public function verify($email) {
		$sql = "UPDATE users SET active='1' WHERE email = :email";
		$stmt = $this->db->connect()->prepare($sql);
		$stmt->bindParam(':email', $email, PDO::PARAM_STR);	
		$stmt->execute();
		return true;
	}
	
	public function resetPassword($newpassword, $email, $hash) {
		$sql = "UPDATE users SET password = :password, hash = :hash WHERE email = :email";
		$stmt = $this->db->connect()->prepare($sql);
		$stmt->bindParam(':password', $newpassword, PDO::PARAM_STR);
		$stmt->bindParam(':email', $email, PDO::PARAM_STR);
		$stmt->bindParam(':hash', $hash, PDO::PARAM_STR);
		$stmt->execute();
		return true;
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