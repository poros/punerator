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
    for (var i = 0; i < words.length; i++) {
        var select = document.createElement('select');
        select.className = "image-picker masonry show-html";
        for (var j = 0; j < RESULTS_NUM; j++) {
            var imgContainer = document.createElement('option');
            imgContainer.setAttribute("data-img-src", images[i][j]);
            imgContainer.setAttribute("value", j);
            select.appendChild(imgContainer);
        }
        var label = document.createElement('div');
        label.className = "group_label";
        label.innerHTML = words[i];
        contentDiv.appendChild(label);
        contentDiv.appendChild(select);
    }
    $("select").imagepicker();
    $("select").masonry({
        itemSelector: 'option',
        columnWidth: 400
    });
    $("#select_button").show();
}

function displayPun() {
    var options = $("select").map(function(idx, el) {
        return this.options[this.value];
    }).get();
    var select = document.createElement('select');
    select.className = "image-picker show-html";
    select.setAttribute("multiple", "multiple");
    var emptyOpt = document.createElement("option")
    emptyOpt.setAttribute("value", "");
    select.appendChild(emptyOpt)
    options.forEach(function(option) {
        select.appendChild(option);
    });
    var contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";
    var pun = document.createElement("div");
    pun.innerHTML = words.join(" ");
    var urls = document.createElement("div");
    for (i =0; i < words.length; i++) {
        var url = document.createElement("div");
        var name = document.createElement("span");
        name.innerHTML = words[i] + ": ";
        url.appendChild(name);
        var btn_id = "clip_btn" + i
        var input = document.createElement("input");
        input.id = btn_id;
        input.setAttribute("value", options[i].getAttribute("data-img-src"));
        url.appendChild(input);
        var button = document.createElement("button");
        button.className = "clip_btn"
        button.setAttribute("data-clipboard-target", "#" + btn_id);
        button.innerHTML = '<img src="assets/clippy.svg" width="13" alt="Copy to clipboard">';
        url.appendChild(button);
        urls.appendChild(url);
    }
    new Clipboard('.clip_btn');
    contentDiv.appendChild(pun);
    contentDiv.appendChild(select);
    contentDiv.appendChild(urls);
    $("select").imagepicker({limit: 0});
    $("#select_button").hide();
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
