(() => {
  
  //*******************
  // DOM Cache Module *
  
  const dom = (() => {
    const listBuilder = document.querySelector('div#listBuilder');
    const typeSelector = listBuilder.querySelector('div.listTypeSelect');
    const editNameSection = listBuilder.querySelector('div#nameEdit');
    const editNameInput = editNameSection.querySelector('#listNameInput');
    const editNameButton = editNameSection.querySelector('#listNameButton');
    const displayNameSection = listBuilder.querySelector('div#nameDisplay');
    const displayNameListName = displayNameSection.querySelector('span.listName');
    const displayNameIcons = displayNameSection.getElementsByTagName('img');
    const listDiv = listBuilder.querySelector('div#list');
    const listUl = listBuilder.querySelector('ul.list');
    const listItems = listUl.children;
    const addItemSection = listBuilder.querySelector('div#addItem');
    const addItemInput = addItemSection.querySelector('input#addItemInput');
    const addItemButton = addItemSection.querySelector('button#addItemButton');
    const addItemSuggestions = addItemSection.querySelector('div#suggestionList');
    const suggestionUl = addItemSuggestions.getElementsByTagName('ul')[0];
    const selection = addItemSuggestions.getElementsByClassName('selected');
    
    return {
      listBuilder : listBuilder,
      typeSelector : typeSelector,
      editNameSection : editNameSection,
      editNameInput : editNameInput,
      editNameButton : editNameButton,
      displayNameSection : displayNameSection,
      displayNameListName : displayNameListName,
      displayNameIcons : displayNameIcons,
      listDiv : listDiv,
      listUl : listUl,
      listItems : listItems,
      addItemSection : addItemSection,
      addItemInput : addItemInput,
      addItemButton : addItemButton,
      addItemSuggestions : addItemSuggestions,
      suggestionUl : suggestionUl,
      selection : selection
    }
  })();
  
  //**********************
  // TypeSelector Module *

  const typeSelector = (() => {
    let type = null;
    
    //Init (loading saved List)
    setTimeout(() => {
      if(dom.listUl.id) {
        setType(dom.listUl.id);
      }
    },0);
    
    // DOM events
    dom.typeSelector.addEventListener('click', (event) => { setType(event); });
    
    // PubSub events
    events.on('nameGiven', checkType);
    events.on('itemAdded', checkType);
    events.on('listDeleted', reset);
    
    // Functions
    function render() {
      if (type != null) {
        dom.typeSelector.style.display = 'none';
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
    
    // Init (loading saved list)
    if (dom.displayNameListName.textContent != '') {
      name = dom.displayNameListName.textContent;
      displayEdit = false;
      render();
    }
    
    // DOM events
    dom.editNameInput.addEventListener('focus', () => { nameInputFocus = true; });
    dom.editNameInput.addEventListener('blur', () => { nameInputFocus = false; });
    dom.editNameButton.addEventListener('click', () => { setName(); });
    for (let i = 0; i < dom.displayNameIcons.length; i++) {
      dom.displayNameIcons[i].addEventListener('click', (event) => { editOrDel(event); });
    }
    
    // PubSub events
    events.on('typeSelected', checkNameType); 
    events.on('itemAdded', checkNameItem);
    events.on('ajax_name', ajaxReturnName);
    events.on('enterKey', enterPressed);
    
    // Functions
    function render() {
      if (name != null) {
        dom.displayNameListName.textContent = name;
      }
      if (displayEdit == false) {
        dom.editNameSection.style.display = 'none';
        dom.displayNameSection.style.display = 'block';
      } else {
        dom.editNameSection.style.display = 'block';
        dom.displayNameSection.style.display = 'none';
        if (name != null) {
          dom.editNameInput.value = name;
          dom.editNameInput.focus();
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
        dom.editNameInput.focus()
      }
    }  
    
    function checkNameItem() {
      if(name == null) {
        setName('unnamed');
      }
    }

    function setName(input) {
      input = input || null;   
      if (input == null && dom.editNameInput.value.replace(/\s/g, '').length) {
        if (dom.editNameInput.value.replace(/\s/g, '').length) {
          input = dom.editNameInput.value;
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
        dom.editNameButton.click();
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
    
    // DOM events
    dom.addItemInput.addEventListener('focus', () => {itemInputFocus(true)});
    dom.addItemInput.addEventListener('blur', () => {itemInputFocus(false)});
    dom.addItemInput.addEventListener('input', () => { getSuggestions(); });
    dom.addItemButton.addEventListener('click', () => { addItem(); });
    dom.addItemSuggestions.addEventListener('click', (event) => { chooseOrDelSug(event) });
    
    // PubSub events
    events.on('typeSelected', typeSelected);
    events.on('listItemsLoaded', (int)=>{listLength = int});
    events.on('ajax_item_added', ()=>{listLength++});
    events.on('itemDeleted', ()=>(listLength--));
    events.on('nameGiven', ()=>{dom.addItemInput.focus();});
    events.on('listDeleted', reset);
    events.on('ajax_suggest', suggestions)
    events.on('enterKey', enterPressed);
    events.on('upKey', upPressed);
    events.on('downKey', downPressed);
    events.on('delKey', delPressed);
    
    // Functions
    function render() {
      
      //Suggestions
      if(suggestionsObj.length > 0 && dom.addItemInputFocus) {
        dom.addItemSuggestions.style.display = 'block';
        displaySuggestions = true;
      } else {
        dom.addItemSuggestions.style.display = 'none';
        displaySuggestions = false;
      }
      var options ='';
      for (let i = 0; i < suggestionsObj.length; i++) {
        options += '<li id="'+suggestionsObj[i].id+'" name="'+suggestionsObj[i].name+'">' +suggestionsObj[i].name+ 
                   '<a class="delsuggestion" id="'+suggestionsObj[i].id+'">del</a></li>';
      }
      dom.suggestionUl.innerHTML = options;
    }
    
    function addItem(string) {
      string = string || dom.addItemInput.value;
      if (string.replace(/\s/g, '').length) {
        let item = JSON.stringify({name:string, position:listLength});
        events.emit('itemAdded', item);
        dom.addItemInput.value = '';
        dom.addItemInput.focus();
      }
    }
    
    function typeSelected(type) {
      listType = type;
      if(type == 'grocery') {
        dom.addItemInput.focus();
      }
    }
    
    function getSuggestions() {
      if(listType == 'grocery') {
        events.emit('getSuggestions', dom.addItemInput.value);
      }
    }
    
    function enterPressed() {
      if (dom.selection.length) {
        dom.selection[0].click();
      }
      else if (dom.addItemInputFocus && dom.selection.length == 0) {
        dom.addItemButton.click();
      }
    }
    
    function upPressed(event) {
      event.preventDefault();
      if(displaySuggestions) {
        if(dom.selection.length == 0) {
          dom.suggestionUl.lastChild.className = 'selected';
        } else {
          if (dom.selection[0] != dom.suggestionUl.firstChild) {
            let prevselection = dom.selection[0].previousElementSibling;
            dom.selection[0].className = '';
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
        if(dom.selection.length == 0) {
          dom.suggestionUl.firstChild.className = 'selected';
        } else {
          if (dom.selection[0] != dom.suggestionUl.lastChild) {
            let nextselection = dom.selection[0].nextElementSibling;
            dom.selection[0].className = '';
            nextselection.className = 'selected';
          }
        }
      } else {
        getSuggestions();
      }
    }
    
    function delPressed(event) {
      if(displaySuggestions) {
        if(dom.selection.length != 0) {
          event.preventDefault();
          dom.selection[0].querySelector('a').click();
        }
      }
    }
    
    function suggestions(obj) {
      suggestionsObj = obj;
      render();
    }
    
    function chooseOrDelSug(event) {
       if (event.target.tagName == 'LI') {
        dom.addItemInput.value = event.target.getAttribute('name');
        dom.selection[0].className = '';
        suggestionsObj = {}
        render();
      }
      if (event.target.tagName == 'A') {
        let id = event.target.id;
        events.emit('delsuggestion', id);
        getSuggestions();
      }
      dom.addItemInput.focus();
    }
    
    function itemInputFocus(bool) {
      dom.addItemInputFocus = bool;
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
    
    // Init (on loading saved list)
    if(dom.listItems.length) {
      for (let i = 0; i<dom.listItems.length; i++) {
        itemsArray.push({
          checked: dom.listItems[i].querySelector('input').checked, 
          name : dom.listItems[i].textContent
        });
      }
      events.emit('listItemsLoaded', dom.listItems.length);
      render();
    }
    
    // DOM events
    dom.listUl.addEventListener('click', (event) => { itemAction(event); });
    
    // PubSub events
    events.on('ajax_item_added', newItem);
    events.on('listDeleted', reset);
    events.on('itemDragged', moveItem);
    
    //Functions
    function render() {
      dom.listUl.innerHTML = '';
      for (let i = 0; i < itemsArray.length; i++) {
        let li = document.createElement('li');
        li.textContent = itemsArray[i].name;
        addItemButtons(li, itemsArray[i].checked);
        dom.listUl.appendChild(li);
      }
      if (dom.listItems.length > 0) {
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
      for (i=0; i<dom.listItems.length; i++) {
      
        let li = dom.listItems[i];
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
        events.emit('itemChecked', JSON.stringify({index: sharedFunctions.getIndex(li), bool: event.target.checked}));
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
  
  
  //**************
  // Drag & drop *
  
  const dragAndDrop = (() => {
    let dragging = null;
    let dragStartIndex = null;
    let dragEndIndex = null;
    
    // DOM events
    dom.listUl.addEventListener('dragstart', (event) => {dragStart(event)});
    dom.listUl.addEventListener('dragleave', (event) => {dragLeave(event)});
    dom.listUl.addEventListener('dragover', (event) => {dragOver(event)});
    dom.listUl.addEventListener('dragend', (event) => {dragEnd(event)});
    dom.listUl.addEventListener('drop', (event) => {dragDrop(event)});
    
    // PubSub events
    events.on('ajax_item_added', render);
    events.on('itemMoved', render);
    events.on('itemsRendered', render);
    
    // Functions
    function render() {
      setTimeout(() => {
        for (let i = 0; i<dom.listItems.length; i++) {
          dom.listItems[i]['draggable'] = 'true';
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
  
  
  //******************
  // Keyboard module *

  const keyboard = (() => {
    
    // DOM Events
    dom.listBuilder.addEventListener('keydown', (event) => { keyPressed(event) });
    
    // Functions
    function keyPressed(event) {
      if(event.keyCode === 13) { events.emit('enterKey', event); }
      if(event.keyCode === 38) { events.emit('upKey', event); }
      if(event.keyCode === 40) { events.emit('downKey', event); }
      if(event.keyCode === 46) { events.emit('delKey', event); }
    }
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