new ReadableStream();
navigator.serviceWorker.register('sw.js', {scope: 'sw-stream'}).then(reg => {
  const oldestWorker = reg.active || reg.waiting || reg.installing;

  function checkState() {
    if (oldestWorker.state == 'activating' || oldestWorker.state == 'activated') {
      document.querySelector('.sw-stream').disabled = false;
    }
  }

  checkState();
  oldestWorker.addEventListener('statechange', checkState);
});