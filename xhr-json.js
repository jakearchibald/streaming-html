(function() {

var content = document.querySelector('.content');

document.querySelector('.xhr-json').addEventListener('click', function() {
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

  var xhr = new XMLHttpRequest();

  xhr.onload = function() {
    var container = content.querySelector('.js-discussion');

    xhr.response.comments.forEach(function(comment) {
      var div = document.createElement('div');
      div.className = comment.class;
      div.innerHTML = comment.html;
      container.appendChild(div);
    });
  };

  xhr.responseType = 'json';
  xhr.open('GET', 'comments.json');
  xhr.send();
});

})();