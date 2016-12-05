function mergeResponses(responsePromises) {
  const readers = responsePromises.map(p => Promise.resolve(p).then(r => r.body.getReader()));
  let fullStreamedResolve;
  let fullyStreamedReject;
  const fullyStreamed = new Promise((r, rr) => {
    fullStreamedResolve = r;
    fullyStreamedReject = rr;
  });
  
  const readable = new ReadableStream({
    pull(controller) {
      return readers[0].then(r => r.read()).then(result => {
        if (result.done) {
          readers.shift();
          
          if (!readers[0]) {
            controller.close();
            fullStreamedResolve();
            return;
          }
          return this.pull(controller);
        }

        controller.enqueue(result.value);
      }).catch(err => {
        fullyStreamedReject(err);
        throw err;
      });
    },
    cancel() {
      fullStreamedResolve();
    }
  });

  return responsePromises[0].then(response => ({
    fullyStreamed,
    response: new Response(readable, {
      headers: response.headers
    })
  }));
}