const todoUl = document.querySelector('ul#todo');
const groceryUl = document.querySelector('ul#grocery');

function addRemoveListener(ul) {
  let lis = ul.children;
  for (let i = 0; i < lis.length; i++) {
    lis[i].addEventListener('click', (e) => {
      if (e.target.className == 'remove') {
        if (confirm("are you sure you want to delete this list?")) {
          let li = e.target.parentNode.parentNode;
          let ul = e.target.parentNode.parentNode.parentNode;
          ajax('dellist', li.id);
          ul.removeChild(li);
        }
      }
    });
  }
}

addRemoveListener(todoUl);
addRemoveListener(groceryUl);
