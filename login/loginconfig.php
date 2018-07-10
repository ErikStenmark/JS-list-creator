<?php
session_start();

function __autoload($class) {
	require_once(dirname(__DIR__)."/class/$class.php");
}
// TimeZone
date_default_timezone_set('Europe/Helsinki');

$db = new Dbh;
$login = new LogIn($db);
?>