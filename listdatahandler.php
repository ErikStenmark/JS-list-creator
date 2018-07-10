<?
include 'inc/config.php';
$listmapper = new Listmapper(new Dbh(), $userid);

if (isset($_SESSION['list']) && $_SESSION['list'] != null) {
	$mode = 'update';
	$listid = $_SESSION['list']->getId();
} else {
	$mode = 'create';
}

function sanitize($string) {
	$string = mb_strtolower(htmlspecialchars(trim($string)));
	$arr = explode(' ',trim($string));
	$arr[0] = mb_convert_case($arr[0], MB_CASE_TITLE, 'UTF-8');
	$result = implode(" ", $arr);
	return $result;
}

function decode_item($json) {
	$data = json_decode($_POST['item'], TRUE);
	$data['type'] = 'item';
	$data['name'] = sanitize($data['name']);
	return $data;
}

// Create list
if ($mode == 'create') {
	// With list name
	if (isset($_POST['name'])) {
		$input = sanitize($_POST['name']);
		$data = array (
			'type' => 'name',
			'name' => $input
		);
	}
	// With list item
	if (isset($_POST['item'])) {
		$data = decode_item($_POST['item']);
	}
	
	$listobject = $listmapper->create_list($data, $datetime);
	$_SESSION['list'] = $listobject;
	echo $data['name'];
}

if ($mode == 'update') {
	// Adding item to list
	if (isset($_POST['item'])) {
		$data = decode_item($_POST['item']);
		$itemid = $listmapper->add_item($_SESSION['list'], $data);
		echo $data['name'];
	}
	
	// Editing list name
	if (isset($_POST['name'])) {
		$input = sanitize($_POST['name']);
		$updatedlistobject = $listmapper->edit_list_name($_SESSION['list'], $input);
		$_SESSION['list'] = $updatedlistobject;
		echo $input;
	}	
}

// Moving item around
if (isset($_POST['moveup'])) { 
	$oldposition = $_POST['moveup'];
	$updatedlistobject = $listmapper->move_item($_SESSION['list'], $oldposition, 'up');
	$_SESSION['list'] = $updatedlistobject;
}
if (isset($_POST['movedown'])) { 
	$oldposition = $_POST['movedown'];
	$updatedlistobject = $listmapper->move_item($_SESSION['list'], $oldposition, 'down');
	$_SESSION['list'] = $updatedlistobject;
}

// Del list or item
if (isset($_POST['dellist'])) {
	$listmapper->del_list($_SESSION['list']);
	unset($_SESSION['list']);
}

if (isset($_POST['delitem'])) {
	$position = $_POST['delitem'];
	echo $position;
	$listobject = $listmapper->remove_item($_SESSION['list'], $position);
	$_SESSION['list'] = $listobject;
}

?>