<?php

class Listmapper {
	private $db;
	private $userid;
	private $listid = null;
	
	public function __construct($db, $userid) {
		$this->db = $db;
		$this->userid = $userid;
	}
	
	// Create list with new list name or item (list id to list object) (list object to session)
	public function create_list($value = [], $datetime) {
		$data['userid'] = $this->userid;
		$data['datetime'] = $datetime;

		// Create list with list name
		if ($value['type'] == 'name') {
			$data['name'] = $value['name'];						// Get list name
			$listid = $this->db->insert('lists', $data);		// Add list to DB
			$data['id'] = $listid;								// Get list id from DB
			$listobject = new Checklist($data);					// Create list object
		}
		
		// Create list with list item
		if ($value['type'] == 'item') {
			
			// Create List
			$listid = $this->db->insert('lists', $data);		// Add unnamed list to DB
			$data['id'] = $listid;								// Get list id from DB
			$listobject = new Checklist($data);					// Create list object
			
			// Add item
			unset($data['datetime']);							// Datetime cannot be set to listitems table
			unset($data['id']);									// Unsets list ID for adding item
			$listobject = $this->add_item($listobject, $value);
		}
		return $listobject;
	}
	
	// Edit list name
	public function edit_list_name($listobject, $name) {
		$listid = $listobject->getId();
		$data['name'] = $name;
		$this->db->update('lists', $listid, $data);
		$listobject->setValues($data);
		return $listobject;
	}
	
	// Add list item (item id to list class)
	public function add_item($listobject, $item) {
		$data['listid'] = $listobject->getId();
		$data['userid'] = $this->userid;
		$data['position'] = $item['position'];
		$data['item'] = $item['name'];
		$itemid = $this->db->insert('listitems', $data);
		$data['items'] = array(	
			'id' => $itemid,
			'position' => $item['position'],
			'name' => $item['name']
			);
		$listobject->setValues($data);
		return $listobject;
	}
	
	private function db_update_item_positions($listarray) {
		// FixMe: For with count is expensive (foreach or while)
		for ($i = 0; $i < count($listarray); $i++) {
			$data['position'] = $listarray[$i]['position'];
			$itemid = $listarray[$i]['id'];
			$this->db->update('listitems', $itemid, $data);
		}
	}
	
	// Remove item
	public function remove_item($listobject, $itemposition) {
		$listid = $listobject->getId();
		$sql = "DELETE from listitems WHERE listid = ? AND position = ?";
		$stmt = $this->db->connect()->prepare($sql);
		$stmt->bindValue(1, $listid);
		$stmt->bindValue(2, $itemposition);
		$stmt->execute();
		
		// Update list object with deleted item returns array of updated list items
		$listitemsarray = $listobject->removeItem($itemposition);
		
		// Update DB with all list entries new positions from previously returned array.
		$this->db_update_item_positions($listitemsarray);

		return $listobject;
	}

	// Move item position
	public function move_item($listobject, $itemoldposition, $direction) {
		if($direction == 'up') {
			$listitemsarray = $listobject->moveItem($itemoldposition, 'up');
		} else {
			$listitemsarray = $listobject->moveItem($itemoldposition, 'down');
		}
		$this->db_update_item_positions($listitemsarray);
		return $listobject;
	}
	
	// Delete list (unset list class from session)
	public function del_list($listobject) {
		$listid = $listobject->getId();
		$this->db->del('listitems', $listid, 'listid');
		$this->db->del('lists', $listid);
	}
	
	// Get saved lists
	public function get_saved_lists() {
		return $this->db->select('lists', $this->userid, 'userid');
	}
	
	// Get saved list
	public function get_saved_list($id) {
		$listobject = new Checklist($this->db->select('lists', $id)[0]);
		
		$data['items'] = $this->db->select('listitems', $id, 'listid', null, 'position');

		$listobject->setValues($data);
		return $listobject;
	}
	
}

?>