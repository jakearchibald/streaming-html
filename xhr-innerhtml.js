(function() {

var content = document.querySelector('.content');

document.querySelector('.xhr-innerhtml').addEventListener('click', function() {
  content.innerHTML = '';
  var xhr = new XMLHttpRequest();

  xhr.onload = function() {
    content.innerHTML = xhr.response;
  };

  xhr.responseType = 'text';
  xhr.open('GET', 'comments.inc.txt');
  xhr.send();
});

})();