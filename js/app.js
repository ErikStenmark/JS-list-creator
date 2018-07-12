const nameSpan = document.querySelector('span.listName');
const editNameField = document.querySelector('span.nameEditField');
const displayNameField = document.querySelector('span.nameDisplay');
const nameInput = document.querySelector('input.listName');
const nameButton = document.querySelector('button.listNameButton');
const editNameIcon = document.querySelector('img.editNameIcon');
const delListIcon = document.querySelector('img.delListIcon');
const addItemInput = document.querySelector('input.addItemInput');
const addItemButton = document.querySelector('button.addItemButton');
const listDiv = document.querySelector('.list');
const listUl = listDiv.querySelector('ul');
const lis = listUl.children;

if (displayNameField.textContent != '') {
	toggleNameEdit(false);
}

nameInput.focus();

function ajax(action, arg){
	arg = arg || 0;
    var hr = new XMLHttpRequest();
    var url = "inc/listdatahandler.php";
	
	// Naming list
	if (action == nameSpan) {
		var vars = "name=" + arg;
	
	// Deleting list
	} else if (action == 'dellist') {
		var vars = "dellist=" + arg;
	
	// Deleting item
	} else if (action == 'delitem') {
		var vars = "delitem=" + arg;
		
	// Adding item to list
	} else if (action == 'ul') {
		var vars = "item=" + JSON.stringify({name:arg, position:lis.length});
	
	// Moving items
	} else if (action == 'up') {
		var vars = "moveup=" + arg;
		
	} else if (action == 'down') {
		var vars = "movedown=" + arg;
	}
	
	hr.open("POST", url, true);
	hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	hr.onreadystatechange = function() {
	    if(hr.readyState == 4 && hr.status == 200) {
		    var return_data = hr.responseText;
			
			// Adding li item
			if (action == 'ul') {
				var ul = document.getElementsByTagName('ul')[0];
				var li = document.createElement('li');
				li.textContent = return_data;
				ul.appendChild(li);
				attachListItemButtons(li);
				evalListButtons(li.previousElementSibling);
				
			// Editing list name
			} if (action == nameSpan) {
				nameSpan.innerHTML = return_data;
			}
		}
	}
    hr.send(vars);
}

function evalListButtons(li) {
	let buttons = li.querySelector('span.listButtons');
	let up = buttons.querySelector('img.up');
	let down = buttons.querySelector('img.down');
	
	if (li == li.parentNode.firstElementChild) {
		up.style.display = 'none';
	} else {
		up.style.display = 'inline';
	}	
	if (li == li.parentNode.lastElementChild) {
		down.style.display = 'none';
	} else {
		down.style.display = 'inline';
	}
}

function updateListButtons() {
	for (let i = 0; i < lis.length; i++) {
		evalListButtons(lis[i]);
	}
}

// Adding move and del buttons to list items
function attachListItemButtons(li) {
	let span = document.createElement('span');
	span.className = 'listButtons';
	li.appendChild(span);
	
	let up = document.createElement('img');
	up.className = 'up';
	up.style.height = '1em';
	up.src = 'img/up.png';
	span.appendChild(up);
	
	let down = document.createElement('img');
	down.className = 'down';
	down.style.height = '1em';
	down.src = 'img/down.png';
	span.appendChild(down)
	
	let remove = document.createElement('img');
	remove.className = 'remove';
	remove.style.height = '1em';
	remove.src = 'img/del.png';
	span.appendChild(remove);
	
	evalListButtons(li);
}

// Get index of list item for position
function GetIndex(sender) {   
    var liElements = sender.parentNode.getElementsByTagName("li");
    var liElementsLength = liElements.length;
    var index;
    for (var i = 0; i < liElementsLength; i++) {
        if (liElements[i] == sender) {
            index = i;
            return(index);
        }
    }
}

// Toggle displaying or edit list name
function toggleNameEdit(bool) {
	if (bool == true) {
		editNameField.style.display = 'block';
		displayNameField.style.display = 'none';
	} else {
		editNameField.style.display = 'none';
		displayNameField.style.display = 'block';
	}
}

// Name list button event listener
nameButton.addEventListener('click', () => {
	if(nameInput.value.replace(/\s/g, '').length) {
		toggleNameEdit(false);
		ajax(nameSpan, nameInput.value);
		addItemInput.focus();
	}
});

// Adding list item buttons for pre-existing list items
for (let i = 0; i < lis.length; i++) {
	attachListItemButtons(lis[i]);
}

// Show list name buttons
displayNameField.addEventListener('mouseover', () => {
	displayNameField.className = 'listName highlight';
	editNameIcon.style.display = 'inline';
	delListIcon.style.display = 'inline';
});

// Hide list name buttons
displayNameField.addEventListener('mouseout', () => {
	displayNameField.className = 'listName';
	editNameIcon.style.display = 'none';
	delListIcon.style.display = 'none';
});

// Click listener for list name buttons
displayNameField.addEventListener('click', (event) => {
	if (event.target == editNameIcon) {
		nameInput.value = nameSpan.innerHTML;
		toggleNameEdit(true);
		nameInput.focus();
	}
	if (event.target == delListIcon) {
		if (confirm("are you sure you want to delete this list?")) {
			ajax('dellist');
			nameSpan.textContent = '';
			nameInput.value = '';
			displayNameField.style.display = 'none';
			editNameField.style.display = 'block';
			while (listUl.firstChild) {
				listUl.removeChild(listUl.firstChild);
			}
			window.location.replace("index.php");
		}
	}
});

// Keyboard enter listener for naming list
editNameField.addEventListener('keyup', (event) => {
	event.preventDefault();
	if (event.keyCode === 13) {
		nameButton.click();
	}
});

// Click listener for adding list item button
addItemButton.addEventListener('click', () => {
	if(addItemInput.value.replace(/\s/g, '').length) {
		ajax('ul', addItemInput.value);
		addItemInput.value = '';
		addItemInput.focus();
	}
});

// Keyboard enter listener for adding list item
addItemInput.addEventListener('keyup', (event) => {
	event.preventDefault();
	if (event.keyCode === 13) {
		addItemButton.click();
	}
});

// Click listener for list item buttons
listUl.addEventListener('click', (event) => {
	if (event.target.tagName == 'IMG') {
		let li = event.target.parentNode.parentNode;
		let position = GetIndex(li);

		if (event.target.className == 'remove') {
			let ul = li.parentNode;
			ajax('delitem', position);
			ul.removeChild(li);
			document.body.style.cursor='default';
		}		
		if (event.target.className == 'up') {
			let prevLi = li.previousElementSibling;
			let ul = li.parentNode;
			if (prevLi) {
				ajax('up', position);
				ul.insertBefore(li, prevLi);
			}	
			document.body.style.cursor='default';
		}			
		if (event.target.className == 'down') {
			let nextLi = li.nextElementSibling;
			let ul = li.parentNode;
			if (nextLi) {
				ajax('down', position);
				ul.insertBefore(nextLi, li);
			}
			document.body.style.cursor='default';
		}
		updateListButtons();
	}
});

// Mouse over listener for list items
listUl.addEventListener('mouseover', (event) => {
	if(event.target.tagName == 'LI') {
		GetIndex(event.target);
		event.target.className = 'highlight';
		event.target.querySelector('span').style.display = 'inline';
	}
	if(event.target.tagName == 'SPAN') {
		event.target.parentNode.className = 'highlight';
		event.target.style.display = 'inline';
	}
	if(event.target.tagName == 'IMG') {
		document.body.style.cursor='pointer'
		event.target.parentNode.parentNode.className = 'highlight';
		event.target.parentNode.style.display = 'inline';
	}
});

// Mouse out listener for list items
listUl.addEventListener('mouseout', (event) => {
	if(event.target.tagName == 'LI') {
		event.target.className = '';
		event.target.querySelector('span').style.display = 'none';
	}
	if(event.target.tagName == 'SPAN') {
		event.target.parentNode.className = '';
		event.target.style.display = 'none';
	}
	if(event.target.tagName == 'IMG') {
		document.body.style.cursor='default'
		event.target.parentNode.parentNode.className = '';
		event.target.parentNode.style.display = 'none';
	}
});