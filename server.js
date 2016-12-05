const express = require('express');
const compression = require('compression');
const compressible = require('compressible');
const app = express();

app.use(compression({
  filter: () => true
}));
app.use('/', express.static('.'));

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});