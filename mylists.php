<?php
include 'inc/config.php';
?>

<!doctype html>

<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Template</title>
	<meta name="description" content="The HTML5 Herald">
	<meta name="author" content="SitePoint">
	<link rel="stylesheet" href="css/style.css?v=1.0">
</head>

<body>
	<div class="wrapper">
		<?php 
			// echo print_r($_SESSION);
			include 'inc/navbar.php'; 
		?>		
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