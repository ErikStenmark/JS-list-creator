<?php
include 'inc/config.php';

if (isset($_GET['listid'])) {
  $_SESSION['list'] = $listmapper->get_saved_list($_GET['listid']);
} else {
  unset($_SESSION['list']);
}
include 'inc/head.php';
?>
<body id="list">
  <div class="wrapper">
    <?php include 'inc/navbar.php'; ?>  
    <content>
      <div class="container">
      
        <h1>List Builder</h1>
        <p>Build your list</p> 

        <div class="listTypeSelect">
          <p>List type:</p>
          <button id="grocery">Grocery</button>
          <button id="todo">Todo</button>
        </div>
        
        <!-- Edit list name input -->
        <span class="nameEdit" style="display: block">
          <input type="text" id="listName" placeholder="Name your list">
          <button id="listNameButton">Change list name</button>
        </span> 
        
        <!-- Display named list name -->
        <span class="nameDisplay" style="display: none; width: auto"><?
          ?><span class="listName" style="font-size: 1.5em"><?php 
            if(isset($_SESSION['list'])) { echo $_SESSION['list']->getName(); }
            ?></span><?
          ?><a href="#"><img class="editNameIcon" src="img/edit.png"></a><?
          ?><a href="#"><img class="delListIcon" src="img/del.png"></a><?
        ?></span>     
        
        <!-- List div -->
        <div class="list" <? if (isset($_SESSION['list'])) { echo 'id="'.$_SESSION['list']->getListType().'"'; } ?>>
          <ul class="list">
            <?php
              if(isset($_SESSION['list'])) {
                $items = $_SESSION['list']->getItems();
                if (!empty($items[0])) {
                  foreach ($items as $item) {
                    if ($item['checked']) {$checked = 'checked';} else {$checked = '';}
                    echo '<li><input type="checkbox"'.$checked.'>'.$item['item'].'</li>';
                  }
                }
              }
            ?>
          </ul>
        </div>
        
        <!-- Add item div -->
          <div>
            <input type="text" 
                   class="addItemInput" 

                   placeholder="Add item to list">
                   
            <button class="addItemButton">Add item</button>
          </div>
        <div id="suggestionList"></div>
        
        
      </div> <!-- End of Container -->    
    </content>  
    <?php include 'inc/footer.php'; ?>  
  </div> <!-- End of Wrapper -->
  <script src="js/func.js"></script>
  <script src="js/list.js"></script>
</body>
</html>
