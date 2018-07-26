// Ajax for PHP / DB backend
function ajax(action, arg){
	arg = arg || 0;
    var hr = new XMLHttpRequest();
    var url = "inc/listdatahandler.php";
	
	// Naming list
	if (action == 'editname') { var vars = "name=" + arg;
	
	// Deleting list /item
	} else if (action == 'dellist') { var vars = "dellist=" + arg;
	} else if (action == 'delitem') { var vars = "delitem=" + arg;
		
	// Adding item to list
	} else if (action == 'ul') {
		var vars = "item=" + JSON.stringify({name:arg, position:lis.length});
	
  // Renaming grocery list with no items
  } else if (action == 'groceryname') { var vars ="groceryname=" + arg;
    
  // Adding item with listType grocery (creates list if needed)
  } else if (action == 'groceryitem') {
    var vars = "groceryitem=" + JSON.stringify({name:arg, position:lis.length});
    
	// Adding name and item
	} else if (action == 'both') {
		var vars = "both=" + 
      JSON.stringify({listname:arg[0], itemname:arg[1], position:lis.length});
		
	// Moving items
	} else if (action == 'up') { var vars = "moveup=" + arg;		
	} else if (action == 'down') { var vars = "movedown=" + arg;
	
	// Checking / unchecking item
	} else if (action == 'check') { var vars = 'check=' + arg;
	} else if (action == 'uncheck') { var vars = 'uncheck=' + arg;
	
  // Get/Del item suggestion
  } else if (action == 'suggest') { var vars = 'suggest=' + arg;
  } else if (action == 'delsuggestion') { var vars = 'delsuggestion=' + arg; }
	
	hr.open("POST", url, true);
	hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	hr.onreadystatechange = function() {
    if(hr.readyState == 4 && hr.status == 200) {
      var return_data = hr.responseText;
    
      // Adding li item
      if (action == 'ul') { addItem(return_data);
        
      // Editing list name
      } if (action == 'editname' || action == 'groceryname') {
        nameList(return_data);
      }
      
      // Crating list with both name and item
      if (action == 'both') {
        var obj = JSON.parse(return_data);
        nameList(obj['listname']);
        addItem(obj['itemname']);
      }
    
      if (action == 'dellist') {
      	console.log(return_data);
      }
      
      // Creating grocery list or adding item
      if (action == 'groceryitem') { addItem(return_data); }
      
      // Creates ul in suggestion list and adds suggestions as li
      if (action == 'suggest') {
        var obj = JSON.parse(return_data);
        if(obj.length > 0) {
          suggestionList.style.display = 'block';
        } else {
          suggestionList.style.display = 'none';
        }
        var options ='<ul>';
        for (let i = 0; i < obj.length; i++) {
          options += '<li id="'+obj[i].id+'" name="'+obj[i].name+'">' +obj[i].name+ 
                     '<a class="delsuggestion" id="'+obj[i].id+'">del</a></li>';
        }
        options += '</ul>';
        suggestionList.innerHTML = options;
      }
    }
	}
    hr.send(vars);
}

// Front-end for naming list (no ajax)
function nameList(name) {
  nameSpan.innerHTML = name;
  toggleNameEdit(false);
  addItemInput.focus();
}

// Front-end for adding list item to list (ajax call not handeled here)
function addItem(name) {
  var ul = document.getElementsByTagName('ul')[0];
  var li = document.createElement('li');
  li.textContent = name;
  let text = '<input type="checkbox" class="checkbox">';
  li.insertAdjacentHTML('afterbegin', text);
  ul.appendChild(li);
  attachListItemButtons(li);
  if (li.previousElementSibling != null) {
    evalListButtons(li.previousElementSibling);
  }
}

// Evaluates the need for up and down buttons (first and last list items)
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

// Loops trough all list items to see which buttons are needed
function updateListButtons() {
  for (let i = 0; i < lis.length; i++) {
    evalListButtons(lis[i]);
  }
}

// Adding move and del buttons to list items
function attachListItemButtons(li) {
  let pageId = document.getElementsByTagName('body')[0].id;
  
  let span = document.createElement('span');
  span.className = 'listButtons';
  li.appendChild(span);
  
  let remove = document.createElement('img');
  remove.className = 'remove';
  remove.style.height = '1em';
  remove.src = 'img/del.png';
  span.appendChild(remove);
  
  if (pageId == 'list') {
    let up = document.createElement('img');
    up.className = 'up';
    up.style.height = '1em';
    up.src = 'img/up.png';
    span.appendChild(up);
    span.insertBefore(up, remove);
    
    let down = document.createElement('img');
    down.className = 'down';
    down.style.height = '1em';
    down.src = 'img/down.png';
    span.appendChild(down)
    span.insertBefore(down, remove);

    evalListButtons(li);
  }
}

// Get index of list item for position
function getIndex(sender) {   
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
    editNameInput.value = '';
    displayNameField.style.display = 'block';
  }
}

// Hide / show list type buttons
function toggleTypeEdit(bool) {
  if (bool == true) {
    listTypeDiv.style.display = 'block';
  } else {
    listTypeDiv.style.display = 'none';
  }
}
