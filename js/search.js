google.load('search', '1');
google.setOnLoadCallback(OnLoad);

var RESULTS_NUM = 8;
var images;
var words;
var called;

function searchComplete(imageSearch, pos) {

  if (imageSearch.results && imageSearch.results.length > 0) {
      var results_urls = []
      imageSearch.results.forEach(function(result) {
          results_urls.push(result.url)
      });
      images[pos] = results_urls
      called = called + 1
      if (called == words.length) {
          displayImages();
      }
  }
}

function displayImages() {
    var contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";
    var select = document.createElement('select');
    select.className = "image-picker masonry show-html";
    for (var i = 0; i < words.length; i++) {
        var row = document.createElement("optgroup");
        row.setAttribute("label", words[i]);
        for (var j = 0; j < RESULTS_NUM; j++) {
            var imgContainer = document.createElement('option');
            imgContainer.setAttribute("data-img-src", images[i][j]);
            imgContainer.setAttribute("value", i * RESULTS_NUM + j);
            imgContainer.innerHTML = "Name"
            row.appendChild(imgContainer);
        }
        select.appendChild(row)
    }
    contentDiv.appendChild(select);
    $("select").imagepicker();
    $("optgroup").masonry({
      itemSelector: 'option',
      columnWidth: 400
    });
}

function search() {
    images = []
    words = document.getElementById("search_bar").value.split(" ");
    called = 0
    for (var i = 0; i < words.length; i++) {
        var word = words[i]
        var imageSearch = new google.search.ImageSearch();
        imageSearch.setResultSetSize(RESULTS_NUM);
        imageSearch.setSearchCompleteCallback(this, searchComplete, [imageSearch, i]);
        imageSearch.setRestriction(
            google.search.ImageSearch.RESTRICT_IMAGESIZE,
            google.search.ImageSearch.IMAGESIZE_MEDIUM);
        imageSearch.execute(word);
    }
}

function OnLoad() {
    // Include the required Google branding
    google.search.Search.getBranding('branding');
}
