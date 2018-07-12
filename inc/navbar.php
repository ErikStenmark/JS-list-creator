<header>
	<div class="navbar">
		<a href="#home">Link 1</a>
		<a href="#news">Link 2</a>
		<div class="dropdown">
			<button class="dropbtn"><?php echo $username; ?></button>
			<div class="dropdown-content">
				<a href="index.php">New list</a>
				<a href="mylists.php">My lists</a>
				<a href="login/logout.php">Log out</a>
			</div>
		</div> 
	</div>
</header>