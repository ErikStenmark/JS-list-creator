<?php

class Checklist {
	private $id = null, $userid, $name, $datetime, $inDB = false;
	private $items = [];
	
	public function __construct ($data = []) {
		if (!empty($data)) {
			$this->setValues($data);
		}
	}
	
	public function setValues($data = []) {
		if (isset($data['id'])) {
			$this->id = $data['id'];
			$this->inDB = true;
		}
		if (isset($data['userid'])) {
			$this->userid = $data['userid'];
		}
		if (isset($data['name'])) {
			$this->name = $data['name'];
		}
		if (isset($data['datetime'])) {
			$this->datetime = $data['datetime'];
		}
		if (isset($data['items'])) {
			if (isset($data['items'][0])) {
				$this->items = $data['items'];
			} else {
				$this->items[] = $data['items'];
			}
		}
	}
	
	public function getId() {
		return $this->id;
	}
	
	public function getUserId() {
		return $this->userid;
	}
	
	public function getName() {
		return $this->name;
	}
	
	public function getItems() {
		return $this->items;
	}
	
	public function checkItem($itemposition, $action) {
		if ($action == 'check') {
			$this->items[$itemposition]['checked'] = 1;
		} else {
			$this->items[$itemposition]['checked'] = 0;
		}
		return $this->items[$itemposition]['id'];
	}
	
	public function removeItem($itemposition) {
		array_splice($this->items, $itemposition, 1);
		foreach ($this->items as $k => $v) {
			$this->items[$k]['position'] = $k;
		}
		return $this->items;
	}
	
	public function moveItem($itemposition, $direction) {
		if ($direction == 'up') {
			$this->items[$itemposition]['position']--;
			$this->items[$itemposition - 1]['position']++;
		} else {
			$this->items[$itemposition]['position']++;
			$this->items[$itemposition + 1]['position']--;
		}
		foreach ($this->items as $k => $v) {
			$newarr[$v['position']] = $this->items[$k];
		}
		$this->items = $newarr;
		ksort($this->items);
		return $this->items;
	}
}
?>