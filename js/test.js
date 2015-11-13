google.load('search', '1');
google.setOnLoadCallback(OnLoad);

function searchComplete(imageSearch, pos) {

  // Check that we got results
  if (imageSearch.results && imageSearch.results.length > 0) {

      // Grab our content div, clear it.
      var contentDiv = document.getElementById('content');

      // Loop through our results, printing them to the page.
      var results = imageSearch.results;
      for (var i = 0; i < results.length; i++) {
          // For each result write it's title and image to the screen
          var result = results[i];
          var imgContainer = document.createElement('span');

          var newImg = document.createElement('img');
          newImg.className = "ImageResult"

          // There is also a result.url property which has the escaped version
          newImg.src = result.url;
          imgContainer.appendChild(newImg);

          contentDiv.appendChild(imgContainer);
      }
  }
}

function search() {
    var contentDiv = document.getElementById('content');
    contentDiv.innerHTML = ""
    words = document.getElementById("search_bar").value.split(" ");
    for (var i = 0; i < words.length; i++) {
        word = words[i]
        imageSearch = new google.search.ImageSearch();
        imageSearch.setResultSetSize(1);
        imageSearch.setSearchCompleteCallback(this, searchComplete, [imageSearch, i]);
        imageSearch.execute(word);
    }
}

function OnLoad() {
    // Include the required Google branding
    google.search.Search.getBranding('branding');
}
