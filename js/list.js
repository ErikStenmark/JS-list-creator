//********************
// TypeSelector Module

const TypeSelector = (() => {
  let type = null;
  
  // DOM Cache
  const listBuilder = document.querySelector('div#listBuilder');
  const typeSelector = listBuilder.querySelector('div.listTypeSelect');
  const editNameSection = listBuilder.querySelector('div#nameEdit');
  const displayNameSection = listBuilder.querySelector('div#nameDisplay');
  const displayNameListName = listBuilder.querySelector('span.listName');

  // Bind events
  typeSelector.addEventListener('click', (event) => { setType(event); });
  
  // Private functions
  const _render = () => {
    if (type != null) {
      typeSelector.style.display = 'none';
      if(type == 'grocery') {
        editNameSection.style.display = 'none';
        displayNameListName.textContent = 'Grocery list';
        displayNameSection.style.display = 'block';
      }
    }
  }
  
  // Public functions
  const setType = (e) => {
    let val = (typeof e === "string") ? e : e.target.id;
    if (val == 'grocery') {
      type = 'grocery';
    } else {
      type = 'todo';
    }
    _render();
  }
  
  const getType = () => {
    return type;
  }
  
  // Expose public functions
  return {
    setType: setType,
    getType: getType
  };
  
})();


//****************
// ListName Module

const ListName = (() => {
  let name = null;
  let displayEdit = true;

  // Cache DOM
  const listBuilder = document.querySelector('div#listBuilder');
  const editNameSection = listBuilder.querySelector('div#nameEdit');
  const editNameInput = editNameSection.querySelector('#listNameInput');
  const editNameButton = editNameSection.querySelector('#listNameButton');
  const displayNameSection = listBuilder.querySelector('div#nameDisplay');
  const displayNameListName = displayNameSection.querySelector('span.listName');
  const displayNameIcons = displayNameSection.getElementsByTagName('img');
  const addItemSection = listBuilder.querySelector('div#addItem');
  const addItemInput = addItemSection.querySelector('input#addItemInput'); 

  
  // Bind Events
  editNameButton.addEventListener('click', () => { setName(); });
  for (let i = 0; i < displayNameIcons.length; i++) {
    displayNameIcons[i].addEventListener('click', (event) => { _editOrDel(event); });
  }

  // Private functions
  const _render = () => {
    if (name != null) {
      displayNameListName.textContent = name;
    }
    if (displayEdit == false) {
      editNameSection.style.display = 'none';
      displayNameSection.style.display = 'block';
    } else {
      editNameSection.style.display = 'block';
      displayNameSection.style.display = 'none';
      if (name != null) {
        editNameInput.value = name;
        editNameInput.focus();
      }
    }
  }
  
  const _getName = () => {
    if (displayNameListName.textContent != '') {
      name = displayNameListName.textContent;
    }
  }
  
  const _editOrDel = (event) => {
    if (event.target.id == 'editNameIcon') {
      toggleEditName(true);
    }
    if (event.target.id == 'delListIcon') {
      delList();
    }
  }
  
  // Public functions
  const setName = (input) => {
    input = input || null;   
    if (input == null) {
      if (editNameInput.value.replace(/\s/g, '').length) {
        input = editNameInput.value;
      }
    }
    if (input != null) {
      if (TypeSelector.type == null) {
        TypeSelector.setType('todo');
      }
      name = input;
    }
    displayEdit = false;
    _render();
  }
  
  const getName = () => {
    return name;
  }
  
  const delList = () => {
    // ToDo...
  }
  
  const toggleEditName = (bool) => {
    displayEdit = bool;
    (bool == true) ? _getName() : null;
    _render();
  }
  
  // Expose public functions
  return {
    setName: setName,
    getName: getName,
    toggleEditName: toggleEditName,
    delList: delList
  }
  
})();
  

//************
// Item module

const Items = (() => {
  let itemsArray = [];
  
  // Cache DOM
  const listBuilder = document.querySelector('div#listBuilder');
  const addItemSection = listBuilder.querySelector('div#addItem');
  const addItemInput = addItemSection.querySelector('input#addItemInput');
  const addItemButton = addItemSection.querySelector('button#addItemButton');
  const addItemSuggestions = addItemSection.querySelector('#groceryItemSuggestions');
  const editNameSection = listBuilder.querySelector('div#nameEdit');
  const editNameInput = editNameSection.querySelector('#listNameInput');
  const listDiv = listBuilder.querySelector('div#list');
  const listUl = listDiv.querySelector('ul');
  const listItems = listUl.children;
  
  // Bind Events
  addItemButton.addEventListener('click', () => {addItem();});
  listUl.addEventListener('click', (event) => {listItemAction(event);});
  
  // Private functions
  const _render = () => {
    listUl.innerHTML = '';
    for (let i = 0; i < itemsArray.length; i++) {
      let li = document.createElement('li');
      li.textContent = itemsArray[i].name;
      let text = '<input type="checkbox" class="checkbox">';
      li.insertAdjacentHTML('afterbegin', text);
      _addItemButtons(li);
      listUl.appendChild(li);
    }

      _evalListButtons();

  }
  
  const _addItemButtons = (li) => {
    
    let span = document.createElement('span');
    span.className = 'listButtons';
    
    let remove = document.createElement('img');
    remove.className = 'remove';
    remove.style.height = '1em';
    remove.src = 'img/del.png';
    span.appendChild(remove);

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

    li.appendChild(span);
  }
  
  const _evalListButtons = (li) => {
    for (i=0; i<listItems.length; i++) {
    
      let li = listItems[i];
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
  }
  
  const _getIndex = (sender) => {   
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
  
  const _array_move = (arr, old_index, new_index) => {
    while (old_index < 0) {
        old_index += arr.length;
    }
    while (new_index < 0) {
        new_index += arr.length;
    }
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  }
  
  // Public functions
  const addItem = (string) => {
    string = string || addItemInput.value;
    if (string.replace(/\s/g, '').length) {
      itemsArray.push({position: itemsArray.length, name : string});
      if (ListName.getName() == null) {ListName.setName('unnamed')}
      _render();
      addItemInput.value = '';
      addItemInput.focus();
    }
  }
  
  const listItemAction = (event) => {
    
    /* // Check boxes
    if (event.target.type == 'checkbox') {
      let li = event.target.parentNode;
      let position = getIndex(li);
      if( event.target.checked) {
        ajax('check', position);
      } else {
        ajax('uncheck', position);
      }
    } */
    
    // Buttons
    if (event.target.tagName == 'IMG') {
      let li = event.target.parentNode.parentNode;
      let position = getIndex(li);

      if (event.target.className == 'remove') {
        itemsArray.splice(position, 1);
      }		
      
      if (event.target.className == 'up') {
        let prevLi = li.previousElementSibling;
        if (prevLi) {
          _array_move(itemsArray, position, position -1);
        }	
      }		
      
      if (event.target.className == 'down') {
        let nextLi = li.nextElementSibling;
        if (nextLi) {
          _array_move(itemsArray, position, position +1)
        }
        document.body.style.cursor='default';
      }
      _render();
      _evalListButtons();
    }
  }
  
// Expose public functions
  return {
    itemsArray: itemsArray,
    addItem: addItem
  }
})();
  
  

  
  
  // })()


/* (function() {

  const listCreator = {
    listType: null,
    
    init: function() {
      this.cacheDom();
    },
    
    cacheDom: function() {
      this.listBuilder = document.querySelector('div#listBuilder');
      this.typeSelector = listBuilder.querySelector('div.listTypeSelect');
      
      this.editNameSection = listBuilder.querySelector('div#nameEdit');
      this.editNameInput = editNameSection.querySelector('#listNameInput');
      this.editNameButton = editNameSection.querySelector('#listNameButton');
      
      this.displayNameSection = listBuilder.querySelector('div#nameDisplay');
      this.displayNameListName = displayNameSection.querySelector('span.listName');
      this.displayNameIcons = displayNameSection.getElementsByTagName('img');
      
      this.listInfo = listBuilder.querySelector('div#listinfo');
      this.listInfoDate = listInfo.querySelector('span#listdate');
      this.listInfoTime = listInfo.querySelector('span#listtime');
      this.listInfoType = listInfo.querySelector('span#listtype');
      
      this.listDiv = listBuilder.querySelector('div#list');
      this.listUL = listDiv.querySelector('ul');
      this.listItems = listUL.children;
      
      this.addItemSection = listBuilder.querySelector('div#addItem');
      this.addItemInput = addItemSection.querySelector('input#addItemInput');
      this.addItemButton = addItemSection.querySelector('button#addItemButton');
      this.addItemSuggestions = addItemSection.querySelector('#groceryItemSuggestions');
    },
    
    render: function(action) {
      if(action == 'selecttype') {
        
      }
      
    }
  };

  listCreator.init();
  
})() */

/* const body = document.querySelector('body');

const listTypeDiv = document.querySelector('div.listTypeSelect');
const editNameField = document.querySelector('span.nameEdit');
const editNameInput = editNameField.querySelector('#listName');
const editNameButton = editNameField.querySelector('#listNameButton');
const displayNameField = document.querySelector('span.nameDisplay');
const nameSpan = document.querySelector('span.listName');
const editNameIcon = document.querySelector('img.editNameIcon');
const delListIcon = document.querySelector('img.delListIcon');
const displayNameType = document.querySelector('span#listtype');
const displayNameDate = document.querySelector('span#listdate');
const addItemInput = document.querySelector('input.addItemInput');
const suggestionList = document.getElementById('suggestionList');
const addItemButton = document.querySelector('button.addItemButton');
const listDiv = document.querySelector('div.list');
const listUl = document.querySelector('ul.list');
const lis = listUl.children;


// Get type of list on loading saved list
// listDiv gets id from PHP object
let listType;
if (listDiv.id != '') {
  listType = listDiv.id;
  if (listType == 'grocery') {
    addSuggestAttributes();
  }
}

// Adding list item buttons for existing list items
for (let i = 0; i < lis.length; i++) {
  attachListItemButtons(lis[i]);
}

// Hide name editing on already named list
if (nameSpan.textContent != '') {
  toggleNameEdit(false);
  toggleTypeEdit(false);
  addItemInput.focus();
} else {
  editNameInput.focus(); 
}

// New list type selection listener
listTypeDiv.addEventListener('click', (e) => {
  if (e.target.id == 'grocery') {
    listType = 'grocery';
    addSuggestAttributes();
    nameList('Grocery list');
  } else {
    listType = 'todo';
  }
  toggleTypeEdit(false);
});

// Click listener for list name buttons
displayNameField.addEventListener('click', (event) => {
  
  // Edit list name
  if (event.target == editNameIcon) {
    editNameInput.value = nameSpan.innerHTML;
    toggleNameEdit(true);
    editNameInput.focus();
  }
  
  // Del list
  if (event.target == delListIcon) {
    if (confirm("are you sure you want to delete this list?")) {
      setTimeout(() => { ajax('dellist', 'session'); }, 0);
      nameSpan.textContent = '';
      editNameInput.value = '';
      displayNameField.style.display = 'none';
      editNameField.style.display = 'block';
      while (listUl.firstChild) {
        listUl.removeChild(listUl.firstChild);
      }
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

function ifgrocery(type) {
  if (type == 'name') {
    if (listType == 'grocery') {
      ajax('groceryname', editNameInput.value);
    } else {
      ajax('name', editNameInput.value);
    }
  } else if (type == 'item') {
      if (listType == 'grocery') {
        ajax('groceryitem', addItemInput.value);
      } else {
        ajax('item', addItemInput.value);
    }
  }
}

// Name list button event listener
editNameButton.addEventListener('click', () => {
  if(editNameInput.value.replace(/\s/g, '').length) {
    if(addItemInput.value.replace(/\s/g, '').length) {
      if(nameSpan.textContent == '') {
        ajax('both', [editNameInput.value, addItemInput.value]);
        addItemInput.value = '';
      }
    }
    ifgrocery('name');
  }
  if(nameSpan.textContent != '') {
    toggleNameEdit(false); // [FixMe: Duplicate in nameList function (func.js) this line added for returning if user deletes value in field.
    toggleTypeEdit(false);
    addItemInput.focus();
  }
});

// Click listener for adding list item button
addItemButton.addEventListener('click', () => {
  if (addItemInput.value.replace(/\s/g, '').length) {
    if (editNameInput.value.replace(/\s/g, '').length) {
      if (nameSpan.textContent == '') {
        ajax('both', [editNameInput.value, addItemInput.value]);
      } else {
        ifgrocery('item');
      }
    } else {
      ifgrocery('item');
    }
    if(editNameInput.value.replace(/\s/g, '').length == 0 && nameSpan.textContent == '') {
        nameSpan.textContent = 'unnamed';
        toggleNameEdit(false);
    }
    suggestionList.innerHTML = '';
    suggestionList.style.display = 'none';
    addItemInput.value = '';
    addItemInput.focus();
    toggleTypeEdit(false);
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

// Adds suggest functionality to item input (only used with grocery mode)
function addSuggestAttributes() {
    var att1 = document.createAttribute("oninput");
    var att2 = document.createAttribute("onfocus");
    att1.value = "getSuggestions()"; 
    att2.value = "getSuggestions()"; 
    addItemInput.setAttributeNode(att1);
    addItemInput.setAttributeNode(att2);
}
 */