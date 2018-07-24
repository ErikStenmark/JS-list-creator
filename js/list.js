const body = document.querySelector('body');

const editNameField = document.querySelector('span.nameEdit');
const editNameInput = editNameField.querySelector('#listName');
const editNameButton = editNameField.querySelector('#listNameButton');
const displayNameField = document.querySelector('span.nameDisplay');
const nameSpan = document.querySelector('span.listName');
const editNameIcon = document.querySelector('img.editNameIcon');
const delListIcon = document.querySelector('img.delListIcon');
const addItemInput = document.querySelector('input.addItemInput');
const suggestionList = document.getElementById('suggestionList');
const addItemButton = document.querySelector('button.addItemButton');
const listUl = document.querySelector('ul.list');
const lis = listUl.children;


// Hide name editing on already named list
if(displayNameField != null) {
  if (displayNameField.textContent != '') {
    toggleNameEdit(false);
    addItemInput.focus();
  } else {
    editNameInput.focus(); 
  }
}

// Name list button event listener
editNameButton.addEventListener('click', () => {
  if(editNameInput.value.replace(/\s/g, '').length) {
    if(addItemInput.value.replace(/\s/g, '').length) {
      ajax('both', [editNameInput.value, addItemInput.value]);
    } else {
      ajax('editname', editNameInput.value);
    }
  }
});

// Adding list item buttons for existing list items
for (let i = 0; i < lis.length; i++) {
  attachListItemButtons(lis[i]);
}

// Click listener for list name buttons
displayNameField.addEventListener('click', (event) => {
  if (event.target == editNameIcon) {
    editNameInput.value = nameSpan.innerHTML;
    toggleNameEdit(true);
    editNameInput.focus();
  }
  if (event.target == delListIcon) {
    if (confirm("are you sure you want to delete this list?")) {
      ajax('dellist', 'session');
      nameSpan.textContent = '';
      editNameInput.value = '';
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
    editNameButton.click();
  }
});

// Click listener for adding list item button
addItemButton.addEventListener('click', () => {
  if (addItemInput.value.replace(/\s/g, '').length) {
    if (editNameInput.value.replace(/\s/g, '').length) {
      ajax('both', [editNameInput.value, addItemInput.value]);
    } else {
      ajax('ul', addItemInput.value);
    }
    suggestionList.innerHTML = '';
    suggestionList.style.display = 'none';
    addItemInput.value = '';
    addItemInput.focus();
  }
});

// Click listener for list item buttons and check boxes
listUl.addEventListener('click', (event) => {	
  
  // Check boxes
  if (event.target.type == 'checkbox') {
    let li = event.target.parentNode;
    let position = getIndex(li);
    if( event.target.checked) {
      ajax('check', position);
    } else {
      ajax('uncheck', position);
    }
  }
  
  // Buttons
  if (event.target.tagName == 'IMG') {
    let li = event.target.parentNode.parentNode;
    let position = getIndex(li);

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

// Shows suggestions for item input when item input has some value
function getSuggestions() {
  if (addItemInput.value == '') {
    suggestionList.innerHTML = '';
    hideSuggestions();
  } else {
    ajax('suggest', addItemInput.value);
  }
}

// Hides suggestions
function hideSuggestions() {
  suggestionList.style.display = 'none';
}

// When "unfocusing" from item input or suggestion list
body.addEventListener('click', (e) => {
  if (e.target != addItemInput || e.target != suggestionList) {
    hideSuggestions();
  }
});

// clicking suggestion or DEL link of suggestion
suggestionList.addEventListener('click', (e) => {
  // Suggestion
  if (e.target.tagName == 'LI') {
    addItemInput.value = e.target.getAttribute('name');
  }
  // DEL link
  if (e.target.tagName == 'A') {
    let id = e.target.id;
    ajax('delsuggestion', id);
    getSuggestions();
  }
  addItemInput.focus();
});

// Keyboard keys for choosing suggestion
addItemInput.addEventListener('keydown', (e) => {
  let suggestions = suggestionList.getElementsByTagName('li').length;
  let selection = suggestionList.getElementsByClassName('selected');
  
  if (suggestions > 0) {
    
    let ul = suggestionList.querySelector('ul');
    let lis = ul.children;
    
    // Down arrow key
    if (e.keyCode == 40) {
      if (suggestionList.style.display = 'none') {
        suggestionList.style.display = 'block';
      }
      e.preventDefault();
      if(selection.length == 0) {
        ul.firstChild.className = 'selected';
      } else {
        if (selection[0] != ul.lastChild) {
          let nextselection = selection[0].nextElementSibling;
          selection[0].className = '';
          nextselection.className = 'selected';
        }
      }
    }
    
    // Up arraow key
    if (e.keyCode == 38) {
      e.preventDefault();
      if(selection.length == 0) {
        ul.lastChild.className = 'selected';
      } else {
        if (selection[0] != ul.firstChild) {
          let prevselection = selection[0].previousElementSibling;
          selection[0].className = '';
          prevselection.className = 'selected';
        }
      }
    }
    
    // Enter when suggestions available
    if (e.keyCode == 13) {
      if(selection.length != 0) { // if item selected adds value to input
        e.preventDefault();
        addItemInput.value = selection[0].getAttribute('name');
        suggestionList.innerHTML = '';
        suggestionList.style.display = 'none';
      } else { // "default" behavior, clicks add to list.
        e.preventDefault();
        addItemButton.click();
      }
    }
    
    // DEL key
    if (e.keyCode == 46) {
      if(selection.length != 0) {
        e.preventDefault();
        selection[0].querySelector('a').click();
      }
    }
  }
  
  // Enter when no suggestions available
  else if (e.keyCode == 13) {
    if(selection.length == 0) {
      e.preventDefault();
      addItemButton.click();
    }
  }
});
