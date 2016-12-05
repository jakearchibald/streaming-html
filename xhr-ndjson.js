(function() {
function streamJSON(url, callback) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    var pos = 0;

    function processChunk(chunk) {
      try {
        var data = JSON.parse(chunk);
      }
      catch (err) {
        reject(Error('Error parsing: ' + chunk));
        xhr.abort();
        return;
      }

      callback(data);
    }

    xhr.onprogress = function() {
      var parts = xhr.response.slice(pos).split('\n');

      parts.slice(0, -1).forEach(function(part) {
        processChunk(part);
        pos += part.length + 1;
      });
    };

    xhr.onload = function() {
      var chunk = xhr.response.slice(pos);
      if (chunk) processChunk(chunk);
      resolve();
    };

    xhr.onerror = function() {
      reject(Error('Connection failed'));
    };

    xhr.responseType = 'text';
    xhr.open('GET', url);
    xhr.send();
  });
}


var content = document.querySelector('.content');

document.querySelector('.xhr-ndjson').addEventListener('click', function() {
  content.innerHTML = '' +
    '<div class="container new-discussion-timeline experiment-repo-nav">' +
      '<div class="repository-content">' +
        '<div class="issues-listing" data-pjax="">' +
          '<div id="show_issue" class="js-issues-results">' +
            '<div id="discussion_bucket" class="clearfix">' +
              '<div class="discussion-timeline js-quote-selection-container ">' +
                '<div class="js-discussion js-socket-channel" data-channel="tenant:1:marked-as-read:issue:162585129"></div>' +
              '</div>' +
            '</div>' +
            '<div class="clear"></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  var container = content.querySelector('.js-discussion');

  streamJSON('comments.ndjson.txt', function(comment) {
    var div = document.createElement('div');
    div.className = comment.class;
    div.innerHTML = comment.html;
    container.appendChild(div);
  });
});

})();