(function() {
  
  //**********************
  // TypeSelector Module *

  const typeSelector = (() => {
    let type = null;
    
    // Cache DOM
    const listBuilder = document.querySelector('div#listBuilder');
    const typeSelector = listBuilder.querySelector('div.listTypeSelect');
    const listUl = listBuilder.querySelector('ul.list');
    
    //Init (loading saved List)
    setTimeout(() => {
      if(listUl.id) {
        setType(listUl.id);
      }
    },0);
    
    // DOM events
    typeSelector.addEventListener('click', (event) => { setType(event); });
    
    // PubSub events
    events.on('nameGiven', checkType);
    events.on('itemAdded', checkType);
    events.on('listDeleted', reset);
    
    // Functions
    function render() {
      if (type != null) {
        typeSelector.style.display = 'none';
      }
    }
    
    function checkType() {
      if(type == null) {
        setType('todo');
      }
    }

    function setType(e) {
      let val = (typeof e === "string") ? e : e.target.id;
      if (val == 'grocery') {
        type = 'grocery';
      } else if(val == 'todo') {
        type = 'todo';
      }
      events.emit('typeSelected', type);
      render();
    }
    
    function reset() {
      type = null;
      render();
    }
    
  })();


  //******************
  // ListName Module *

  const listName = (() => {
    let name = null;
    let displayEdit = true;
    let nameInputFocus = false;
    
    // Cache DOM
    const listBuilder = document.querySelector('div#listBuilder');
    const editNameSection = listBuilder.querySelector('div#nameEdit');
    const editNameInput = editNameSection.querySelector('#listNameInput');
    const editNameButton = editNameSection.querySelector('#listNameButton');
    const displayNameSection = listBuilder.querySelector('div#nameDisplay');
    const displayNameListName = displayNameSection.querySelector('span.listName');
    const displayNameIcons = displayNameSection.getElementsByTagName('img');
    
    // Init (loading saved list)
    if (displayNameListName.textContent != '') {
      name = displayNameListName.textContent;
      displayEdit = false;
      render();
    }
    
    // DOM events
    editNameInput.addEventListener('focus', () => { nameInputFocus = true; });
    editNameInput.addEventListener('blur', () => { nameInputFocus = false; });
    editNameButton.addEventListener('click', () => { setName(); });
    for (let i = 0; i < displayNameIcons.length; i++) {
      displayNameIcons[i].addEventListener('click', (event) => { editOrDel(event); });
    }
    
    // PubSub events
    events.on('typeSelected', checkNameType); 
    events.on('itemAdded', checkNameItem);
    events.on('ajax_name', ajaxReturnName);
    events.on('enterKey', enterPressed);
    
    // Functions
    function render() {
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
    
    function editOrDel(event) {
      if (event.target.id == 'editNameIcon') {
        toggleEditName(true);
      }
      if (event.target.id == 'delListIcon') {
        if (confirm("are you sure you want to delete this list?")) {
          events.emit('listDeleted', 'session');
          reset();
          window.location.replace("index.php")
        }
      }
    }
    
    function checkNameType(type) {
      if(type == 'grocery' && name == null) {
        name = 'Grocery list';
        displayEdit = false;
        render();
      }
      if(type == 'todo' && name == null) {
        editNameInput.focus()
      }
    }  
    
    function checkNameItem() {
      if(name == null) {
        setName('unnamed');
      }
    }

    function setName(input) {
      input = input || null;   
      if (input == null && editNameInput.value.replace(/\s/g, '').length) {
        if (editNameInput.value.replace(/\s/g, '').length) {
          input = editNameInput.value;
        }
      }
      if (input != null) {
        events.emit('nameGiven', input);
      }
      displayEdit = false;
    }
    
    function ajaxReturnName(string) {
      name = string;
      render();
    }
    
    function toggleEditName(bool) {
      displayEdit = bool;
      render();
    }
    
    function enterPressed() {
      if(nameInputFocus) {
        editNameButton.click();
      }
    }
    
    function reset() {
      name = null;
      displayEdit = true;
      render();
    }
    
  })();
    

  //******************
  // Add item module *

  const addItem = (() => {
    let listType = null;
    let listLength = 0;
    let addItemInputFocus = false;
    let suggestionsObj = {};
    let displaySuggestions = false;
    
    // Cache DOM
    const listBuilder = document.querySelector('div#listBuilder');
    const addItemSection = listBuilder.querySelector('div#addItem');
    const addItemInput = addItemSection.querySelector('input#addItemInput');
    const addItemButton = addItemSection.querySelector('button#addItemButton');
    const addItemSuggestions = addItemSection.querySelector('div#suggestionList');
    const suggestionUl = addItemSuggestions.getElementsByTagName('ul')[0];
    const selection = addItemSuggestions.getElementsByClassName('selected');
    
    // DOM events
    addItemInput.addEventListener('focus', () => {itemInputFocus(true)});
    addItemInput.addEventListener('blur', () => {itemInputFocus(false)});
    addItemInput.addEventListener('input', () => { getSuggestions(); });
    addItemButton.addEventListener('click', () => { addItem(); });
    addItemSuggestions.addEventListener('click', (event) => { chooseOrDelSug(event) });
    
    // PubSub events
    events.on('typeSelected', typeSelected);
    events.on('listItemsLoaded', (int)=>{listLength = int});
    events.on('ajax_item_added', ()=>{listLength++});
    events.on('itemDeleted', ()=>(listLength--));
    events.on('nameGiven', ()=>{addItemInput.focus();});
    events.on('listDeleted', reset);
    events.on('ajax_suggest', suggestions)
    events.on('enterKey', enterPressed);
    events.on('upKey', upPressed);
    events.on('downKey', downPressed);
    events.on('delKey', delPressed);
    
    // Functions
    function render() {
      
      //Suggestions
      if(suggestionsObj.length > 0 && addItemInputFocus) {
        addItemSuggestions.style.display = 'block';
        displaySuggestions = true;
      } else {
        addItemSuggestions.style.display = 'none';
        displaySuggestions = false;
      }
      var options ='';
      for (let i = 0; i < suggestionsObj.length; i++) {
        options += '<li id="'+suggestionsObj[i].id+'" name="'+suggestionsObj[i].name+'">' +suggestionsObj[i].name+ 
                   '<a class="delsuggestion" id="'+suggestionsObj[i].id+'">del</a></li>';
      }
      suggestionUl.innerHTML = options;
    }
    
    function addItem(string) {
      string = string || addItemInput.value;
      if (string.replace(/\s/g, '').length) {
        let item = JSON.stringify({name:string, position:listLength});
        events.emit('itemAdded', item);
        addItemInput.value = '';
        addItemInput.focus();
      }
    }
    
    function typeSelected(type) {
      listType = type;
      if(type == 'grocery') {
        addItemInput.focus();
      }
    }
    
    function getSuggestions() {
      if(listType == 'grocery') {
        events.emit('getSuggestions', addItemInput.value);
      }
    }
    
    function enterPressed() {
      if (selection.length) {
        selection[0].click();
      }
      else if (addItemInputFocus && selection.length == 0) {
        addItemButton.click();
      }
    }
    
    function upPressed(event) {
      event.preventDefault();
      if(displaySuggestions) {
        if(selection.length == 0) {
          suggestionUl.lastChild.className = 'selected';
        } else {
          if (selection[0] != suggestionUl.firstChild) {
            let prevselection = selection[0].previousElementSibling;
            selection[0].className = '';
            prevselection.className = 'selected';
          }
        }
      } else {
        getSuggestions();
      }
    }
    
    function downPressed(event) {
      event.preventDefault();
      if(displaySuggestions) {
        if(selection.length == 0) {
          suggestionUl.firstChild.className = 'selected';
        } else {
          if (selection[0] != suggestionUl.lastChild) {
            let nextselection = selection[0].nextElementSibling;
            selection[0].className = '';
            nextselection.className = 'selected';
          }
        }
      } else {
        getSuggestions();
      }
    }
    
    function delPressed(event) {
      if(displaySuggestions) {
        if(selection.length != 0) {
          event.preventDefault();
          selection[0].querySelector('a').click();
        }
      }
    }
    
    function suggestions(obj) {
      suggestionsObj = obj;
      render();
    }
    
    function chooseOrDelSug(event) {
       if (event.target.tagName == 'LI') {
        addItemInput.value = event.target.getAttribute('name');
        selection[0].className = '';
        suggestionsObj = {}
        render();
      }
      if (event.target.tagName == 'A') {
        let id = event.target.id;
        events.emit('delsuggestion', id);
        getSuggestions();
      }
      addItemInput.focus();
    }
    
    function itemInputFocus(bool) {
      addItemInputFocus = bool;
      setTimeout(() => {
        render();
      }, 300);
    }
    
    function reset() {
      listType = null;
      listLength = 0;
    }
    
  })();


  //*******************
  // List item module *

  const listItem = (() => {
    let itemsArray = [];
    
    // Cache DOM
    const listBuilder = document.querySelector('div#listBuilder');
    const listDiv = listBuilder.querySelector('div#list');
    const listUl = listDiv.querySelector('ul');
    const listItems = listUl.children;
    
    // Init (on loading saved list)
    if(listItems.length) {
      for (let i = 0; i<listItems.length; i++) {
        itemsArray.push({
          checked: listItems[i].querySelector('input').checked, 
          name : listItems[i].textContent
        });
      }
      events.emit('listItemsLoaded', listItems.length);
      render();
    }
    
    // DOM events
    listUl.addEventListener('click', (event) => { itemAction(event); });
    
    // PubSub events
    events.on('ajax_item_added', newItem);
    events.on('listDeleted', reset);
    events.on('itemDragged', moveItem);
    
    //Functions
    function render() {
      listUl.innerHTML = '';
      for (let i = 0; i < itemsArray.length; i++) {
        let li = document.createElement('li');
        li.textContent = itemsArray[i].name;
        addItemButtons(li, itemsArray[i].checked);
        listUl.appendChild(li);
      }
      if (listItems.length > 0) {
        evalListButtons();
      }
    }
    
    function addItemButtons(li, checked) {
      let check = '';
      if(checked) { check = 'checked'; }
      let text = '<input type="checkbox" class="checkbox" '+check+'>';
      li.insertAdjacentHTML('afterbegin', text);
      
      let span = document.createElement('span');
      span.className = 'listButtons';
      
      let remove = document.createElement('img');
      remove.className = 'remove';
      remove.src = 'img/del.png';
      span.appendChild(remove);

      let up = document.createElement('img');
      up.className = 'up';
      up.src = 'img/up.png';
      span.appendChild(up);
      span.insertBefore(up, remove);
      
      let down = document.createElement('img');
      down.className = 'down';
      down.src = 'img/down.png';
      span.appendChild(down)
      span.insertBefore(down, remove);

      li.appendChild(span);
    }
    
    function evalListButtons() {
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
    
    function newItem(item){
      itemsArray.push({checked: false, name : item});
      render();
    }
    
    function itemAction(event) {
      // Check boxes
      if (event.target.type == 'checkbox') {
        let li = event.target.parentNode;
        let position = sharedFunctions.getIndex(li);
        itemsArray[position].checked = event.target.checked;
        events.emit('itemChecked', JSON.stringify({index: getIndex(li), bool: event.target.checked}));
      }
      // Buttons
      if (event.target.tagName == 'IMG') {
        let li = event.target.parentNode.parentNode;
        let position = sharedFunctions.getIndex(li);

        if (event.target.className == 'remove') {
          itemsArray.splice(position, 1);
          events.emit('itemDeleted', position);
        }		
        
        if (event.target.className == 'up') {
          let prevLi = li.previousElementSibling;
          if (prevLi) {
            array_move(itemsArray, position, position -1);
            events.emit('itemMoved', JSON.stringify({position: position, direction: 'up'}));
          }	
        }		
        
        if (event.target.className == 'down') {
          let nextLi = li.nextElementSibling;
          if (nextLi) {
            array_move(itemsArray, position, position +1)
            events.emit('itemMoved', JSON.stringify({position: position, direction: 'down'}));
          }
        }
        render();
      }
    }
    
    function moveItem(json) {
      obj = JSON.parse(json);
      array_move(itemsArray, obj['position'], obj['direction']);
      render();
      events.emit('itemsRendered');
    }
    
    function array_move(arr, old_index, new_index) {
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
    
    function reset() {
      itemsArray = [];
      render();
    }
    
  })();
    

  //******************
  // Keyboard module *

  const keyboard = (() => {
    
    // Cache DOM
    const listBuilder = document.querySelector('div#listBuilder');
    
    // DOM Events
    listBuilder.addEventListener('keydown', (event) => { keyPressed(event) });
    
    // Functions
    function keyPressed(event) {
      if(event.keyCode === 13) { events.emit('enterKey', event); }
      if(event.keyCode === 38) { events.emit('upKey', event); }
      if(event.keyCode === 40) { events.emit('downKey', event); }
      if(event.keyCode === 46) { events.emit('delKey', event); }
    }
    
  })();
  
  //**************
  // Drag & drop *
  
  const dragAndDrop = (() => {
    let dragging = null;
    let dragStartIndex = null;
    let dragEndIndex = null;
    
    // Cache DOM
    const listBuilder = document.querySelector('div#listBuilder');
    const listDiv = listBuilder.querySelector('div#list');
    const listUl = listDiv.querySelector('ul');
    const listItems = listUl.children;
    
    // DOM events
    listUl.addEventListener('dragstart', (event) => {dragStart(event)});
    listUl.addEventListener('dragleave', (event) => {dragLeave(event)});
    listUl.addEventListener('dragover', (event) => {dragOver(event)});
    listUl.addEventListener('dragend', (event) => {dragEnd(event)});
    listUl.addEventListener('drop', (event) => {dragDrop(event)});
    
    // PubSub events
    events.on('ajax_item_added', render);
    events.on('itemMoved', render);
    events.on('itemsRendered', render);
    
    // Functions
    function render() {
      setTimeout(() => {
        for (let i = 0; i<listItems.length; i++) {
          listItems[i]['draggable'] = 'true';
        }
      },0);
    }
    
    function dragStart(event) {
      if(event.target.tagName == 'LI') {
        dragging = event.target;
        dragStartIndex = sharedFunctions.getIndex(event.target);
        event.dataTransfer.setData('text/html', dragging);
        event.target.classList.add('drag-hold');
      }
    }    
    
    function dragLeave(event) {
      if(event.target.tagName == 'LI') {
        event.target.style['border-bottom'] = '';
        event.target.style['border-top'] = '';
      }
    }
    
    function dragOver(event) {
      event.preventDefault();
      if(event.target.tagName == 'LI') {
        var bounding = event.target.getBoundingClientRect()
        var offset = bounding.y + (bounding.height/2);
        if ( event.clientY - offset > 0 && event.target == event.target.parentNode.lastChild) {
          event.target.style['border-bottom'] = 'solid 2px blue';
          event.target.style['border-top'] = '';
        } else {
          event.target.style['border-top'] = 'solid 2px blue';
          event.target.style['border-bottom'] = '';
        }
      }
    }
    
    function dragEnd(event) {
      event.target.classList.remove('drag-hold');
    }
    
    function dragDrop(event) {
      event.preventDefault();
      if(event.target.tagName == 'LI') {
        if ( event.target.style['border-bottom'] !== '' ) {
          event.target.style['border-bottom'] = '';
          dragEndIndex = sharedFunctions.getIndex(event.target.parentNode.lastChild);
        } else {
          event.target.style['border-top'] = '';
          if (event.target == event.target.parentNode.firstChild) {
            dragEndIndex = 0; 
          } else {
            if (sharedFunctions.getIndex(event.target) > dragStartIndex) {
              dragEndIndex = sharedFunctions.getIndex(event.target)-1; 
            } else {
              dragEndIndex = sharedFunctions.getIndex(event.target); 
            }
          }
        }
        events.emit('itemDragged', JSON.stringify({position: dragStartIndex, direction: dragEndIndex}));
      }
    }
    
    // Init
    render();
    
  })();
  
  //*******************
  // Shared functions *
  
  const sharedFunctions = (() => {
    
    function getIndex(item) {   
      var liElements = item.parentNode.getElementsByTagName("li");
      var liElementsLength = liElements.length;
      var index;
      for (var i = 0; i < liElementsLength; i++) {
        if (liElements[i] == item) {
            index = i;
            return(index);
        }
      }
    }
    
    return {
      getIndex:getIndex
    }
    
  })();
  
})();