(function() {

  //**************
  // AJAX Module *

  const ajax = (() => {
    let type = null;
    
    // PubSub events
    events.on('typeSelected', typeSelect);
    events.on('nameGiven', nameChange);
    events.on('itemAdded', itemAdd);
    events.on('itemChecked', itemCheck);
    events.on('itemMoved', itemMove);
    events.on('itemDragged', itemMove);
    events.on('itemDeleted', itemDelete);
    events.on('listDeleted', listDelete);
    events.on('getSuggestions', getSuggestions);
    events.on('delsuggestion', delsuggestion);
    
    // Functions
    function run(action, arg) {
      arg = arg || 0;
        var hr = new XMLHttpRequest();
        var url = "inc/listdatahandler.php";
      
      // AJAX sends
      
      // Naming list
      if (action == 'name') { var vars = "name=" + arg;
      // Renaming grocery list with no items
      } else if (action == 'groceryname') { var vars ="groceryname=" + arg;
      // Adding item to list
      } else if (action == 'item') { var vars = "item=" + arg;
      // Adding grocery item (creates list if needed)
      } else if (action == 'groceryitem') { var vars = "groceryitem=" + arg;
      // Moving items
      } else if (action == 'move') { var vars = "move=" + arg;		
      // Checking / unchecking item
      } else if (action == 'checkbox') { var vars = 'checkbox=' + arg;
      // Deleting list /item
      } else if (action == 'dellist') { var vars = "dellist=" + arg;
      } else if (action == 'delitem') { var vars = "delitem=" + arg;
      // Get/Del item suggestion
      } else if (action == 'suggest') { var vars = 'suggest=' + arg;
      } else if (action == 'delsuggestion') { var vars = 'delsuggestion=' + arg; }
      
      hr.open("POST", url, true);
      hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      hr.onreadystatechange = function() {
        if(hr.readyState == 4 && hr.status == 200) {
          var return_data = hr.responseText;
          
          // Ajax returns
          
          // Editing list name
           if (action == 'name' || action == 'groceryname') {
            events.emit('ajax_name', return_data);
          }
          // Adding item
          if (action == 'item' || action == 'groceryitem') {
            events.emit('ajax_item_added', return_data);
          }
          // Returning suggestions
          if (action == 'suggest') {
            var obj = JSON.parse(return_data);
            events.emit('ajax_suggest', obj);
          }          
        }
      }
      hr.send(vars);
    }
    
    function typeSelect(string) {
      type = string;
    }
    
    function nameChange(name) {
      setTimeout(() => {
        if(type == 'todo') {
          run('name', name);
        } else if(type == 'grocery') {
          run('groceryname', name);
        }
      }, 0);
    }
    
    function itemAdd(item) {
      setTimeout(() => {
        if(type == 'todo') {
          run('item', item);
        } else if(type == 'grocery') {
          run('groceryitem', item);
        }
      }, 1);
    }
    
    function itemCheck(obj) {
      run('checkbox', obj);
    }
    
    function itemMove(obj) {
      run('move', obj);
    }
    
    function itemDelete(int) {
      run('delitem', int);
    }
    
    function listDelete(arg) {
      type = null;
      run('dellist', arg);
    }
    
    function getSuggestions(string) {
      run('suggest', string);
    }
    
    function delsuggestion(int) {
      run('delsuggestion', int);
    }
    
  })();
})();