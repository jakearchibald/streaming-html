(function() {

var content = document.querySelector('.content');
var iframe = document.createElement('iframe');
iframe.style.display = 'none';
document.body.appendChild(iframe);
var iframeReady = new Promise(function(resolve) {
  iframe.onload = function() {
    iframe.onload = null;
    resolve();
  };
  iframe.src = '';
});


document.querySelector('.streaming-iframe').addEventListener('click', function() {
  content.innerHTML = '';
  iframeReady.then(function() {
    var xhr = new XMLHttpRequest();
    var pos = 0;
    iframe.contentDocument.write('<streaming-element>');
    content.appendChild(iframe.contentDocument.querySelector('streaming-element'));

    xhr.onprogress = function() {
      iframe.contentDocument.write(xhr.response.slice(pos));
      pos = xhr.response.length;
    };

    xhr.onload = function() {
      iframe.contentDocument.write('</streaming-element>');
      iframe.contentDocument.close();
    };

    xhr.responseType = "text";
    xhr.open('GET', 'comments.inc.txt');
    xhr.send();
  });
});

})();