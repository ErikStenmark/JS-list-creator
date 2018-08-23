<?php
include 'inc/config.php';
include 'inc/head.php';
?>
<body id="lists">
	<div class="wrapper">
		<?php include 'inc/navbar.php'; ?>		
		<main>
			<div class="container">	
				<h1>My Lists</h1>
				<p>All your saved lists</p>			
          <div id="savedLists">
					<?php 
            $lists = $listmapper->get_saved_lists();
            $render->render_lists($lists);
					?>
          </div>
        <div id="clearfix"></div>
      </div>
		</main>	
		<?php include 'inc/footer.php'; ?>
	</div> <!-- End of Wrapper-->
  <script src="js/pubsub.js"></script>
  <script src="js/ajax.js"></script>
  <script src="js/lists.js"></script>
</body>
</html>