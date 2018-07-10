<?php
session_start();

function __autoload($class) {
	require_once(dirname(__DIR__)."\\class\\$class.php");
}


date_default_timezone_set('Europe/Helsinki');
$datetime = date('Y-m-d H:i:s');

if ( $_SESSION['logged_in'] != 1 ) {
	header("location: login/index.php");
} else {
	include 'loginvars.php';
}

$db = new Dbh();
$listmapper = new Listmapper($db, $_SESSION['id']);

?>