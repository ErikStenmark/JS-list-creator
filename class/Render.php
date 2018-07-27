<?php
class Render {
  
  private function dateparse($date, $format = 'YYYY-MM-DD') {
		if ($format == 'YYYY-MM-DD') list($year, $month, $day) = explode('-', $date);
		return $day . '.' . $month . '.' . $year;
	}
  
  private function date_time_render($datetime) {
      $separate = explode(' ', $datetime);
      $date = $this->dateparse($separate[0]);
      $time = date('H:i', strtotime($separate[1]));
      return array(
        'date' => $date,
        'time' => $time);
  }
  
  public function render_lists($array) {
    $todolists = '<ul class="list" id="todo"><p class="listtype">Todo lists:</p>';
    $grocerylists = '<ul class="list" id="grocery"><p class="listtype">Grocery lists:</p>';
    $counttodo = 0;
    $countgrocery = 0;
    
    foreach ($array as $list) {
      $listhtml = 
      '<li id="'.$list['id'].'">'.

      '<div>'.
      '<img class="remove" id="dellist" src="img/del.png">'.
      '</div>'.
      '<div>'.
      '<a href="index.php?listid='.$list['id'].'">'.$list['name'].'</a>'.
      '</div>'.
      '<div>'.
      '<p class="date">'.$this->date_time_render($list['datetime'])['date'].'</p>'.
      '<p class="time">'.$this->date_time_render($list['datetime'])['time'].'</p>'.
      '</div>'.
      '<div id="clearfix"></div>'.
      '</li>';
      
      if ($list['type'] == 'todo') {
        $todolists .= $listhtml;
        $counttodo++;
      } else {
        $grocerylists .= $listhtml;
        $countgrocery++;
      }
    }
    $todolists .= '</ul>';
    $grocerylists .= '</ul>';
    if($counttodo != 0) { echo $todolists; }
    if($countgrocery != 0) { echo $grocerylists; }
  }
}
?>