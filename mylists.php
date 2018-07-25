<?php
include 'inc/config.php';
include 'inc/head.php';
?>
<body id="lists">
	<div class="wrapper">
		<?php include 'inc/navbar.php'; ?>		
		<content>
			<div class="container">	
				<h1>My Lists</h1>
				<p>All your saved lists</p>			
				<ul class="list">
					<?php 
						foreach ($listmapper->get_saved_lists() as $list) {
							echo '<li id="'.$list['id'].'">';
							echo '<a href="index.php?listid='.$list['id'].'">'.$list['name'].'</a>';
							echo '&nbsp';
							echo $list['datetime'];
              echo '&nbsp';
              echo $list['type'];
							echo '</li>';
						}
					?>
				</ul>		
			</div>
		</content>	
		<?php include 'inc/footer.php'; ?>
	</div> <!-- End of Wrapper-->
  <script src="js/func.js"></script>
  <script src="js/lists.js"></script>
</body>
</html>