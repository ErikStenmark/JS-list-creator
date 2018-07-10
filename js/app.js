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

nameInput.focus();

function ajax(action, arg){
	arg = arg || 0;
    var hr = new XMLHttpRequest();
    var url = "listdatahandler.php";
	
	// Naming list
	if (action == nameSpan) {
		var vars = "name=" + encodeURIComponent(arg);
	
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
				attachListItemButtons(li);
				ul.appendChild(li);
				
			// Editing list name
			} if (action == nameSpan) {
				nameSpan.innerHTML = return_data;
			}
			
			// Del (no ajax action, only DB)
			// if (action == 'del' && string == 'item') {
				// var body = document.getElementsByTagName('body')[0];
				// var div = document.createElement('div');
				// div.innerHTML = return_data;
				// body.appendChild(div);
			// }
			
			// Moving item (no ajax action, only DB)
		}
	}
    hr.send(vars);
}

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
}

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

function toggleNameEdit(bool) {
	if (bool == true) {
		editNameField.style.display = 'block';
		displayNameField.style.display = 'none';
	} else {
		editNameField.style.display = 'none';
		displayNameField.style.display = 'block';
	}
}



nameButton.addEventListener('click', () => {
	if(nameInput.value.replace(/\s/g, '').length) {
		toggleNameEdit(false);
		ajax(nameSpan, nameInput.value);
		addItemInput.focus();
	}
});

for (let i = 0; i < lis.length; i++) {
	attachListItemButtons(lis[i]);
}

displayNameField.addEventListener('mouseover', () => {
	displayNameField.className = 'listName highlight';
	editNameIcon.style.display = 'inline';
	delListIcon.style.display = 'inline';
});

displayNameField.addEventListener('mouseout', () => {
	displayNameField.className = 'listName';
	editNameIcon.style.display = 'none';
	delListIcon.style.display = 'none';
});

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
			nameInput.focus();
		}
	}
});

editNameField.addEventListener('keyup', (event) => {
	event.preventDefault();
	if (event.keyCode === 13) {
		nameButton.click();
	}
});

addItemButton.addEventListener('click', () => {
	if(addItemInput.value.replace(/\s/g, '').length) {
		ajax('ul', addItemInput.value);
		addItemInput.value = '';
		addItemInput.focus();
	}
});

addItemInput.addEventListener('keyup', (event) => {
	event.preventDefault();
	if (event.keyCode === 13) {
		addItemButton.click();
	}
});

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
			ajax('up', position);
			if (prevLi) {
				ul.insertBefore(li, prevLi);
			}	
			document.body.style.cursor='default';
		}			
		if (event.target.className == 'down') {
			let nextLi = li.nextElementSibling;
			let ul = li.parentNode;
			ajax('down', position);
			if (nextLi) {
				ul.insertBefore(nextLi, li);
			}
			document.body.style.cursor='default';
		}
	}
});

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