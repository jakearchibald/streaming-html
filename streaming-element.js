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

    this.writable = new WritableStream({
      start: async () => {
        const iframe = await iframeReady;
        iframe.contentDocument.write('<streaming-element-inner>');
        this.appendChild(iframe.contentDocument.querySelector('streaming-element-inner'));
      },
      async write(chunk) {
        const iframe = await iframeReady;
        iframe.contentDocument.write(chunk);
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

  response.body
    .pipeThrough(new TextDecoder())
    .pipeTo(streamingElement.writable);
});