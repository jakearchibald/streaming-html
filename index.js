const fs = require('fs');
const mime = require('mime-types');
const express = require('express');
const Throttle = require('stream-throttle').Throttle;
const app = express();

app.get('/:bps/:path', (req, res) => {
  const type = mime.lookup(req.params.path);
  const stream = fs.createReadStream(`${__dirname}/docs/${req.params.path}`);
  stream.on('error', () => {
    res.send('Not found');
  });
  res.set('Content-Type', type);
  stream.pipe(new Throttle({rate: Number(req.params.bps)})).pipe(res);
});

app.use('/', express.static('docs'));

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});