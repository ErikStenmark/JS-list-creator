const todoUl = document.querySelector('ul#todo');
const groceryUl = document.querySelector('ul#grocery');

function addRemoveListener(ul) {
  let lis;
  if(ul != null) {
    lis = ul.getElementsByTagName('LI');
  }
  if (lis != null) {
    for (let i = 0; i < lis.length; i++) {
      lis[i].addEventListener('click', (e) => {
        if (e.target.className == 'remove') {
          if (confirm("are you sure you want to delete this list?")) {
            let li = e.target.parentNode.parentNode;
            let ul = li.parentNode;
            let ulparent = ul.parentNode;
            ajax('dellist', li.id);
            ul.removeChild(li);
            let ulChildCount = lis.length;
            console.log(ulChildCount);
            if(ulChildCount == 0) {
              ulparent.removeChild(ul);
            }
          }
        }
      });
    }
  }
}

addRemoveListener(todoUl);
addRemoveListener(groceryUl);
