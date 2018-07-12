<?php
include 'inc/config.php';
include 'inc/head.php';
?>
	<div class="wrapper">
		<?php include 'inc/navbar.php'; ?>		
		<content>
			<div class="container">	
				<h1>My Lists</h1>
				<p>All your saved lists</p>			
				<ul>
					<?php 
						foreach ($listmapper->get_saved_lists() as $list) {
							echo '<li>';
							echo '<a href="index.php?listid='.$list['id'].'">'.$list['name'].'</a>';
							echo '&nbsp';
							echo $list['datetime'];
							echo '</li>';
						}
					?>
				</ul>		
			</div>
		</content>	
		<?php include 'inc/footer.php'; ?>
	</div> <!-- End of Wrapper-->
</body>
</html>