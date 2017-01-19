customElements.define('streaming-element', class StreamingElement extends HTMLElement {
  constructor() {
    super();

    const iframeReady = new Promise(resolve => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      iframe.onload = () => {
        iframe.onload = null;
        resolve(iframe);
      };
      iframe.src = '';
    });

    async function end() {
      const iframe = await iframeReady;
      iframe.contentDocument.write('</streaming-element-inner>');
      iframe.contentDocument.close();
      iframe.remove();
    }

    const decoder = new TextDecoder();

    this.writable = new WritableStream({
      start: async () => {
        const iframe = await iframeReady;
        iframe.contentDocument.write('<streaming-element-inner>');
        this.appendChild(iframe.contentDocument.querySelector('streaming-element-inner'));
      },
      async write(chunk) {
        const iframe = await iframeReady;
        const decodedChunk = decoder.decode(chunk, {stream: true});
        iframe.contentDocument.write(decodedChunk);
      },
      close: end,
      abort: end
    });
  }
});

document.querySelector('.streaming-element').addEventListener('click', async () => {
  const content = document.querySelector('.content');
  content.innerHTML = '';

  const streamingElement = document.createElement('streaming-element');
  content.appendChild(streamingElement);

  const response = await fetch('comments.inc.txt');

  // not supported?
  // response.body.pipeTo(streamingElement.writable);

  const writer = streamingElement.writable.getWriter();
  const reader = response.body.getReader();
  let result;

  while ((result = await reader.read()) && !result.done) {
    writer.write(result.value);
  }
  writer.close();
});