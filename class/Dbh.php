<?php
include 'Dbconf.php'; 

class Dbh {

	public function connect() {		
		try {
			$pdo = new PDO('sqlite:' . DB_PATH);
			$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			return $pdo;
		} catch (PDOException $e) {
			echo "Connection failed: ".$e->getMessage();
		}
	}
	
	public function esc($string) {
		if (strlen($string) > 0) {
			return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
		}
	}
	
	public function select_all($table) {
		try {
			$sql = "SELECT * FROM $table";
			$stmt = $this->connect()->query($sql);
			while ($row = $stmt->fetchAll(PDO::FETCH_ASSOC)) {
				$results = $row;
			}
		} catch (Exception $e) {
			echo $e->getMessage();
			die();
		}
		return $results;
	}
	
	public function select($table, $value, $field = 'id', $what = null, $orderby = null) {
		try {
			if ($what == null) {
				$sql = "SELECT * from $table WHERE $field = ?";
			} else {
				if (is_array($what)) {
					$what = implode(", ", $what);
				}
				$sql = "SELECT $what from $table WHERE $field = ?";
			}
			if ($orderby != null) {
				$sql .= " ORDER BY $orderby";
			}
			$stmt = $this->connect()->prepare($sql);
			$stmt->bindValue(1, $value);
			$stmt->execute();
		} catch (Exception $e) {
			echo $e->getMessage();
			die();
		}
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
	
	public function insert($table, $data) {
		$keys = array_keys($data);
		$values = array_values($data);
		
		try {
			$sql = "INSERT INTO $table (".implode(',',$keys).") VALUES (:".implode(',:',$keys).")";
			$stmt = $this->connect()->prepare($sql);
			for ($i = 0; $i < sizeof($keys); $i++) {
				$stmt->bindParam(':'.$keys[$i], $values[$i]);
			}
			$stmt->execute();
			$sql2 = $sql2 = "SELECT seq FROM sqlite_sequence where name='$table'";
			$stmt = $this->connect()->query($sql2);
			$insertid = $stmt->fetch()['seq'];
		} catch (Exception $e) {
			echo $e->getMessage();
			die();
		}
		return $insertid;
	}	
	
	public function del($table, $id, $field = 'id') {
		try {
			$sql = "DELETE FROM $table WHERE $field = ?";
			$stmt = $this->connect()->prepare($sql);
			$stmt->bindParam(1, $id);
			$stmt->execute();
		} catch (Exception $e) {
				echo $e->getMessage();
				die();
		}
	}
	
	public function update($table, $id, $data){
		$update = '';
		$i = 0;
		$len = count($data);
		foreach ($data as $k => $v) {
			if ($i < $len - 1){
				$update .= $k.' = :'.$k.', ';
			} else {
				$update .= $k.' = :'.$k;
			}
			$i++;
		}
		
		try {
			$sql = "UPDATE $table SET $update WHERE id = $id";
			$stmt = $this->connect()->prepare($sql);
			$pdonull = null;
			foreach ($data as $k => &$v) {
				if (($v != 0) && ($v == "NULL" || $v == "null" || $v == "")) {
					$stmt->bindParam($k, $pdonull);
				} else {
					$stmt->bindParam($k, $v);
				}
			}
			$stmt->execute();
		} catch (Exception $e) {
		echo $e->getMessage();
		die();
		}
	}
}