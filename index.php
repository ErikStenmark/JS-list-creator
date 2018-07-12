<?php
include 'inc/config.php';

if (isset($_GET['listid'])) {
	$_SESSION['list'] = $listmapper->get_saved_list($_GET['listid']);
} else {
	unset($_SESSION['list']);
}
include 'inc/head.php';
?>
	<div class="wrapper">
		<?php include 'inc/navbar.php'; ?>	
		<content>
			<div class="container">
				<h1>List Builder</h1>
				<p>Build your list</p>	
				<span class="nameEditField" style="display: block">
					<input type="text" class="listName" placeholder="Name your list">
					<button class="listNameButton">Change list name</button>
				</span>	
				<span class="nameDisplay" style="display: none; width: auto"><?
					?><span class="listName" style="font-size: 1.5em"><?php 
						if(isset($_SESSION['list'])) { echo $_SESSION['list']->getName(); }
						?></span><?
					?><a href="#"><img class ="editNameIcon" src="img/edit.png" style="height: 1.5em; display: none;"></a><?
					?><a href="#"><img class ="delListIcon" src="img/del.png" style="height: 1.5em; display: none;"></a><?
				?></span>			
				<div class="list">
					<ul>
						<?php
							if(isset($_SESSION['list'])) {
								foreach ($_SESSION['list']->getItems() as $item) {
									echo '<li>'.$item['item'].'</li>';
								}
							}
						?>
					</ul>
				</div>
				<input type="text" class="addItemInput" placeholder="Add item to list">
				<button class="addItemButton">Add item</button>
			</div>				
		</content>	
		<?php include 'inc/footer.php'; ?>	
	</div> <!-- End of Wrapper -->
	<script src="js/app.js"></script>
</body>
</html>