google.load('search', '1');
google.setOnLoadCallback(OnLoad);

var RESULTS_NUM = 8;
var PAGES_NUM = 8;
var images;
var words;
var called;

function searchComplete(imageSearch, pos) {
    if (imageSearch.results && imageSearch.results.length > 0) {
        imageSearch.results.forEach(function(result) {
            images[pos].push(result.url);
        });
        curr = imageSearch.cursor.currentPageIndex;
        if (curr < PAGES_NUM) {
            imageSearch.gotoPage(curr + 1);
        }
    }
    called = called + 1;
    if (called == (words.length * PAGES_NUM)) {
        displayImages();
    }
}

var createClickHandler = function(i) {
    return function() {
        old_page = $("#sel_" + i).data("page");
        if (old_page < PAGES_NUM) {
            page = old_page + 1;
            $("#sel_" + i).data('picker').destroy();
            var select = document.createElement('select');
            select.className = "image-picker masonry show-html";
            $(select).data("page", page);
            for (var j = 0; j < RESULTS_NUM; j++) {
                var imgContainer = document.createElement('option');
                imgContainer.dataset.imgSrc =  images[i][page * RESULTS_NUM + j];
                imgContainer.setAttribute("value", j);
                select.appendChild(imgContainer);
            }
            $("#sel_" + i).replaceWith($(select));
            select.id = "sel_" + i;
            $(select).imagepicker();
            $(select).masonry({
                itemSelector: 'option',
                columnWidth: 400
            });
        }
    };
}

function displayImages() {
    $("#services").show();
    var contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";
    for (var i = 0; i < words.length; i++) {
        var select = document.createElement('select');
        select.className = "image-picker masonry show-html";
        select.id = "sel_" + i;
        $(select).data("page", 0);
        for (var j = 0; j < RESULTS_NUM; j++) {
            var imgContainer = document.createElement('option');
            imgContainer.dataset.imgSrc =  images[i][j];
            imgContainer.setAttribute("value", j);
            select.appendChild(imgContainer);
        }
        var label = document.createElement('div');
        label.className = "group_label";
        var name = document.createElement('span');
        name.innerHTML = words[i];
        label.appendChild(name);
        var more_btn = document.createElement('input');
        more_btn.type = "button";
        more_btn.setAttribute("value", "More");
        $(more_btn).click(createClickHandler(i));
        label.appendChild(more_btn);
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
    select.id = "select_final_list"
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
    pun.className = "group_label" 
    pun.innerHTML = words.join(" ");
    var urls = document.createElement("div");
    for (var i =0; i < words.length; i++) {
        var url = document.createElement("div");
        url.className = "div_final_list"
        var name = document.createElement("span");
        name.className = "span_final_list"
        name.innerHTML = words[i] + ": ";
        url.appendChild(name);
        var btn_id = "clip_btn" + i
        var input = document.createElement("input");
        input.className = "input_final_list"
        input.id = btn_id;
        input.setAttribute("value", options[i].dataset.imgSrc);
        url.appendChild(input);
        var button = document.createElement("button");
        button.className = "clip_btn"
        button.dataset.clipboardTarget = "#" + btn_id;
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
    words = document.getElementById("search_bar").value.split(" ");
    images = [];
    for (var i = 0; i < words.length; i++) {
        images[i] = [];
    }
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
