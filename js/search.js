google.load('search', '1');
google.setOnLoadCallback(OnLoad);

var RESULTS_NUM = 3;
var images;
var words;

function searchComplete(imageSearch, pos) {

  if (imageSearch.results && imageSearch.results.length > 0) {
      var results_urls = []
      imageSearch.results.forEach(function(result) {
          results_urls.push(result.url)
      });
      images[pos] = results_urls
      if (images.length == words.length) {
          displayImages();
      }
  }
}

function displayImages() {
    var contentDiv = document.getElementById('content');
    contentDiv.innerHTML = ""
    for (var i = 0; i < RESULTS_NUM; i++) {
        var row = document.createElement('div');
        for (var j = 0; j < words.length; j++) {
            var imgContainer = document.createElement('span');
            var newImg = document.createElement('img');
            newImg.className = "ImageResult"
            newImg.src = images[j][i];
            imgContainer.appendChild(newImg);
            row.appendChild(imgContainer);
        }
        contentDiv.appendChild(row)
    }
}

function search() {
    images = []
    words = document.getElementById("search_bar").value.split(" ");
    for (var i = 0; i < words.length; i++) {
        var word = words[i]
        var imageSearch = new google.search.ImageSearch();
        imageSearch.setResultSetSize(RESULTS_NUM);
        imageSearch.setSearchCompleteCallback(this, searchComplete, [imageSearch, i]);
        imageSearch.execute(word);
    }
}

function OnLoad() {
    // Include the required Google branding
    google.search.Search.getBranding('branding');
}
