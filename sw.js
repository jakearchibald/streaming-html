importScripts(
  'async-waituntil-polyfill.js',
  'merge-responses.js'
);

addEventListener('install', event => {
  event.waitUntil(
    caches.open('streaming-sw-test-static-v1').then(cache =>
      cache.addAll([
        'start.html',
        'end.html'
      ])
    )
  );
});

addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (!url.pathname.endsWith('sw-stream')) return;
  
  const parts = [
    caches.match('start.html'),
    fetch('comments.inc.txt'),
    caches.match('end.html')
  ];

  event.respondWith(
    mergeResponses(parts).then(({fullyStreamed, response}) => {
      event.waitUntil(fullyStreamed);
      return response;
    })
  );
});