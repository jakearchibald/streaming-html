document.querySelector('.streaming-iframe').addEventListener('click', function() {
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

  content.innerHTML = '';
  iframeReady.then(function() {
    var xhr = new XMLHttpRequest();
    var pos = 0;
    iframe.contentDocument.write('<streaming-element-inner>');
    content.appendChild(iframe.contentDocument.querySelector('streaming-element-inner'));

    xhr.onprogress = function() {
      iframe.contentDocument.write(xhr.response.slice(pos));
      pos = xhr.response.length;
    };

    xhr.onload = function() {
      iframe.contentDocument.write('</streaming-element-inner>');
      iframe.contentDocument.close();
      document.body.removeChild(iframe);
    };

    xhr.responseType = "text";
    xhr.open('GET', 'comments.inc.txt');
    xhr.send();
  });
});