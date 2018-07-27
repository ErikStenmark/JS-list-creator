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
					<?php 
            $lists = $listmapper->get_saved_lists();
            $render->render_lists($lists);
					?>
				</ul>		
        <div id="clearfix"></div>
      </div>
		</content>	
		<?php include 'inc/footer.php'; ?>
	</div> <!-- End of Wrapper-->
  <script src="js/func.js"></script>
  <script src="js/lists.js"></script>
</body>
</html>