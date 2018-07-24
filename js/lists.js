const listUl = document.querySelector('ul.list');
const lis = listUl.children;

for (let i = 0; i < lis.length; i++) {
  attachListItemButtons(lis[i]);

  lis[i].addEventListener('click', (e) => {
    if (event.target.className == 'remove') {
      if (confirm("are you sure you want to delete this list?")) {
        let li = e.target.parentNode.parentNode;
        let ul = e.target.parentNode.parentNode.parentNode;
        ajax('dellist', li.id);
        ul.removeChild(li);
      }
    }
  });
}
