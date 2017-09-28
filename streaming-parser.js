document.querySelector('.streaming-parser').addEventListener('click', async () => {
  const Parser = require('parse5/lib/parser');
  const domTreeAdapter = require('dom-treeadapter')(document);

  const fragmentContext = document.querySelector('.content');
  fragmentContext.innerHTML = '';

  const response = await fetch('comments.inc.txt');

  const parser = new Parser({
    treeAdapter: domTreeAdapter
  });

  parser._bootstrap(document, fragmentContext);

  if (parser.treeAdapter.getTagName(fragmentContext) === 'template')
    parser._pushTmplInsertionMode('IN_TEMPLATE_MODE');

  parser._initTokenizerForFragmentParsing();

  for (let el = fragmentContext; el; el = el.parentElement) {
    parser.openElements.items.unshift(el);
    parser.openElements.stackTop++;
  }

  parser.openElements._updateCurrentElement();

  parser._resetInsertionMode();
  parser._findFormInFragmentContext();

  response.body
    .pipeThrough(new TextDecoder())
    .pipeTo(new WritableStream({
      write(chunk) {
        parser.tokenizer.write(chunk, false);
        parser._runParsingLoop(null);
      },
      close() {
        parser.tokenizer.write('', true);
        parser._runParsingLoop(null);
      }
    }));
});