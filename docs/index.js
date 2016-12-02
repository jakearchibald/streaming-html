const iframe = document.createElement('iframe');
document.body.appendChild(iframe);

iframe.onload = () => {
  iframe.onload = null;
  const xhr = new XMLHttpRequest();
  let pos = 0;
  iframe.contentDocument.write('<streaming-element>');
  document.body.appendChild(iframe.contentDocument.querySelector('streaming-element'));
  window.streamingScriptExecuted = false;
  iframe.contentDocument.write('<script>window.streamingScriptExecuted = true</script>');
  iframe.contentDocument.write('<script src="log.js"></script>');

  xhr.onprogress = () => {
    iframe.contentDocument.write(xhr.response.slice(pos));
    pos = xhr.response.length;
  };

  xhr.onload = () => {
    iframe.contentDocument.write('</streaming-element>');
    iframe.contentDocument.close();
  };

  xhr.responseType = "text";
  xhr.open('GET', '/post.html');
  xhr.send();
};

iframe.src = '';