<?php
ini_set('display_errors', 'On');

include 'class/Dbh.php';

$db = new Dbh();

echo var_dump($db->connect());

$username = 'ersten';

$stmt = $db->connect()->prepare("SELECT * FROM users WHERE username = :name");
$stmt->bindParam(':name', $username);
$stmt->execute();
$row = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo print_r($row);

echo phpinfo();

?>