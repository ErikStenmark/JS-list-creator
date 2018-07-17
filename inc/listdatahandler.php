<?
/*
- Receives data from JS AJAX and sends sanitized data to Listmapper Object.
- Receives returns from object and updates $_SESSION
- Echos sanitized userinput back to JS.
*/

include 'config.php';
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

// Adding item recieves JSON with item name and list position.
function decode_item($json, $listname = false) {
		$data = json_decode($json, TRUE);
	if ($listname == false) {
		$data['type'] = 'item';
		$data['name'] = sanitize($data['name']);
	} else {
		$data['type'] = 'both';
		$data['listname'] = sanitize($data['listname']);
		$data['itemname'] = sanitize($data['itemname']);
	}
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
	
	if (isset($_POST['both'])) {
		$data = decode_item($_POST['both'], true);
	}
	
	$_SESSION['list'] = $listmapper->create_list($data, $datetime);
	
	if (isset($_POST['both'])) {
		echo json_encode(array('listname' => $data['listname'], 'itemname' => $data['itemname']));
	} else {
		echo $data['name'];
	}
}

if ($mode == 'update') {
	// Adding item to list
	if (isset($_POST['item'])) {
		$data = decode_item($_POST['item']);
		$listmapper->add_item($_SESSION['list'], $data);
		echo $data['name'];
	}
	
	// Editing list name
	if (isset($_POST['name'])) {
		$input = $_POST['name'];
		$_SESSION['list'] = $listmapper->edit_list_name($_SESSION['list'], $input);
		echo $input;
	}	
}

// Moving item around
if (isset($_POST['moveup'])) { 
	$_SESSION['list'] = $listmapper->move_item($_SESSION['list'], $_POST['moveup'], 'up');
}

if (isset($_POST['movedown'])) { 
	$_SESSION['list'] = $listmapper->move_item($_SESSION['list'], $_POST['movedown'], 'down');
}

// Checking item
if (isset($_POST['check'])) {
	$_SESSION['list'] = $listmapper->check_item($_SESSION['list'], $_POST['check'], 'check');
	echo $_POST['check'].' '.'checked';
}

if (isset($_POST['uncheck'])) {
	$_SESSION['list'] = $listmapper->check_item($_SESSION['list'], $_POST['uncheck'], 'uncheck');
	echo $_POST['check'].' '.'unchecked';
}

// Deleting list or item
if (isset($_POST['dellist'])) {
	$listmapper->del_list($_SESSION['list']);
	unset($_SESSION['list']);
}

if (isset($_POST['delitem'])) {
	$_SESSION['list'] = $listmapper->remove_item($_SESSION['list'], $_POST['delitem']);
}

?>