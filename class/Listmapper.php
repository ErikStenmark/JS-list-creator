<?php
class Listmapper {
  private $db;
  private $userid;
  
  public function __construct($db, $userid) {
    $this->db = $db;
    $this->userid = $userid;
  }
  
  // Create list with new list name or item (list id to list object) (list object to session)
  public function create_list($value = [], $datetime) {
    $data['userid'] = $this->userid;
    $data['datetime'] = $datetime;

    // Create list with list name
    if ($value['method'] == 'name') {
      if(isset($value['type'])) {
        $data['type'] = $value['type'];
      }
      $data['name'] = $value['name'];                   // Get list name
      $data['id'] = $this->db->insert('lists', $data);  // Add list to DB
      $listobject = new Checklist($data);               // Create list object
    }
    
    // Create list with list item
    if ($value['method'] == 'item') {
      if (isset($value['listType']) && $value['listType'] == 'grocery') {
        $data['type'] = 'grocery';
        $data['name'] = 'Grocery list';
      }
      // Create List
      $data['id'] = $this->db->insert('lists', $data);  // Add unnamed list to DB
      $listobject = new Checklist($data);               // Create list object
      
      // Add item
      unset($data['datetime']);                         // Datetime cannot be set to listitems table
      unset($data['id']);                               // Unsets list ID for adding item
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
    $listType = $listobject->getListType();
    $data['listid'] = $listobject->getId();
    $data['userid'] = $this->userid;
    $data['position'] = $item['position'];
    $data['item'] = $item['name'];
    $itemid = $this->db->insert('listitems', $data);
    if($listType == 'grocery') {
      try {
        $this->db->insert('dictionary', array('name' => $data['item'], 'userid' => $data['userid']), true);
      } catch (PDOException $e) {
        return $e;
      }
    }
    $data['items'] = array( 
      'id' => $itemid,
      'position' => $item['position'],
      'item' => $item['name'],
      'checked' => '0'
      );
    $listobject->setValues($data);
    return $listobject;
  }
  
  // Updates list item positions in DB when moving or deleting items
  private function db_update_item_positions($listarray) {
    foreach ($listarray as $item) {
      $data['position'] = $item['position'];
      $this->db->update('listitems', $item['id'], $data);
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
  public function move_item($listobject, $array) {
    if($array['direction'] === 'up') {
      $listitemsarray = $listobject->moveItem($array['position'], 'up');
    } else if ($array['direction'] === 'down') {
      $listitemsarray = $listobject->moveItem($array['position'], 'down');
    } else if (is_int($array['direction'])) {
      $listitemsarray = $listobject->moveItem($array['position'], $array['direction']);
    }
    $this->db_update_item_positions($listitemsarray);
    return $listobject;
  }
  
  // Check item
  public function check_item($listobject, $array) {
    $itemid = $listobject->checkItem($array['index'], (int)$array['bool']);
    $this->db->update('listitems', $itemid, array('checked' => (int)$array['bool']));
    return $listobject;
  }
  
  // Delete list (unset list class from session!)
  public function del_list($listobject) {
    $listid = $listobject->getId();
    $this->db->del('listitems', $listid, 'listid');
    $this->db->del('lists', $listid);
  }
  
  // Get saved lists
  public function get_saved_lists() {
    return $this->db->select('lists', $this->userid, 'userid', null, 'datetime', true);
  }
  
  // Get saved list
  public function get_saved_list($id) {
    $listobject = new Checklist($this->db->select('lists', $id)[0]);
    if ($listobject->getUserId() == $this->userid) {
      $select = array('id', 'position', 'item', 'checked');
      $data['items'] = $this->db->select('listitems', $id, 'listid', $select, 'position');

      $listobject->setValues($data);
      return $listobject;
    }
  }
  
  // Get suggestions from dictionary table
  public function suggest_items($string) {
    $var = $string.'%';
    $sql = "SELECT * from dictionary WHERE userid = ? AND name LIKE ?";
    $stmt = $this->db->connect()->prepare($sql);
    $stmt->bindValue(1, $this->userid);
    $stmt->bindValue(2, $var);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }
  
  // Delete suggestion from dictionary table
  public function del_suggestion($id) {
    $this->db->del("dictionary", $id);
  }
}
?>