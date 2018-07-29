<?php
include 'inc/config.php';

if (isset($_GET['listid'])) {
  $_SESSION['list'] = $listmapper->get_saved_list($_GET['listid']);
  $listname = $_SESSION['list']->getName();
  $listdate = $render->date_time_render($_SESSION['list']->getListDate());
  $listtype = $_SESSION['list']->getListType();
  $listitems = $_SESSION['list']->getItems();
} else { unset($_SESSION['list']); }

include 'inc/head.php';
?>

<body id="list">
  <div class="wrapper">
  <?php include 'inc/navbar.php'; ?>
  
    <content>
      <div class="container" id="listBuilder">

        <h1>List Builder</h1>
        <p>Build your list</p> 

        <div class="listTypeSelect">
          <p>List type:</p>
          <button id="grocery">Grocery</button>
          <button id="todo">Todo</button>
        </div>

        <!-- Edit list name input -->
        <div id="nameEdit" style="display: block">
          <input type="text" id="listNameInput" placeholder="Name your list">
          <button id="listNameButton">Change list name</button>
        </div> 

        <!-- Display named list name -->
        <div id="nameDisplay" style="display: none; width: auto"><?
          ?><span class="listName" style="font-size: 1.5em"><?php 
            if(isset($_SESSION['list'])) {echo $listname;}
            ?></span><?
          ?><a href="#"><img id="editNameIcon" src="img/edit.png"></a><?
          ?><a href="#"><img id="delListIcon" src="img/del.png"></a><?
        ?></div>
        
        <?php if (isset($_SESSION['list'])) { ?>
        <div id="listinfo">
          <span id="listdate"><?php echo $listdate['date']; ?></span>
          <span id="listtime"><?php echo $listdate['time']; ?></span>
          <span id="listtype"><?php echo $listtype; ?></span>
        </div>
        <?php } ?> 
        
        <!-- List div -->
        <div id="list">
          <ul class="list" <?php if (isset($_SESSION['list'])) {echo 'id="'.$listtype.'"';} ?>>
            <?php
              if(isset($_SESSION['list'])) {
                $render->render_list_items($listitems);
              }
            ?>
          </ul>
        </div>

        <!-- Add item div -->
        <div id="addItem">
          <input type="text" 
                 id="addItemInput" 
                 placeholder="Add item to list">
          <button id="addItemButton">Add item</button>
        </div>
        <div id="groceryItemSuggestions"></div>


      </div> <!-- End of Container -->    
    </content>  
    <?php include 'inc/footer.php'; ?>  
  </div> <!-- End of Wrapper -->
  <script src="js/func.js"></script>
  <script src="js/list.js"></script>
</body>
</html>
