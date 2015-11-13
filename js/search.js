google.load('search', '1');
google.setOnLoadCallback(OnLoad);

var RESULTS_NUM = 8;
var PAGES_NUM = 8;
var images;
var words;
var called;
var random_search = false;

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

function searchCompleteLucky(imageSearch, pos) {
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
        displayRandomPun();
    }
}

var createClickHandler = function(i) {
    return function() {
        old_page = $("#sel_" + i).data("page");
        page = (old_page + 1) % PAGES_NUM;
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
        $("img").error(function() {
            broken_url = $(this).attr("src");
            var l = 0;
            for (var i = 0; i < images.length; i++) {
                if (images[i].indexOf(broken_url) != -1) {
                    break;
                }
            }
            var url = images[i][Math.floor(Math.random() * images[i].length)];
            $(this).attr("src", url);
            var opt = $("option").filter(function(idx) {
                return this.dataset.imgSrc == broken_url;
            }).get(0)
            opt.dataset.imgSrc = url;
        });
        $(select).masonry({
            itemSelector: 'option',
            columnWidth: 400
        });
    };
}

function displayRandomPun() {
    $("#services").show();
    var select = document.createElement('select');
    select.id = "select_final_list"
    select.className = "image-picker show-html";
    var emptyOpt = document.createElement("option")
    emptyOpt.setAttribute("value", "");
    select.appendChild(emptyOpt)
    var k = 1;
    var opts_urls = [];
    for (var i =0; i< words.length; i++) {
        opts_urls.push(images[i][Math.floor(Math.random() * images[i].length)]);
    }
    opts_urls.forEach(function(url) {
        var imgContainer = document.createElement('option');
        imgContainer.dataset.imgSrc = url;
        imgContainer.setAttribute("value", k);
        k += 1;
        select.appendChild(imgContainer);
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
        name.innerHTML = words[i];
        url.appendChild(name);
        var btn_id = "clip_btn" + i
        var input = document.createElement("input");
        input.className = "input_final_list"
        input.id = btn_id;
        input.setAttribute("value", opts_urls[i]);
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
    $(select).imagepicker();
    $("img").error(function() {
        broken_url = $(this).attr("src");
        var l = 0;
        for (var i = 0; i < images.length; i++) {
            if (images[i].indexOf(broken_url) != -1) {
                break;
            }
        }
        var url = images[i][Math.floor(Math.random() * images[i].length)];
        $(this).attr("src", url);
        var opt = $("option").filter(function(idx) {
            return this.dataset.imgSrc == broken_url;
        }).get(0)
        opt.dataset.imgSrc = url;
    });
    $("#next_button").show();
    $("#select_button").show();
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
        more_btn.id = "button_multiple_imgs"
        more_btn.type = "button";
        more_btn.setAttribute("value", "More");
        $(more_btn).click(createClickHandler(i));
        label.appendChild(more_btn);
        contentDiv.appendChild(label);
        contentDiv.appendChild(select);
    }
    $("select").imagepicker();
    $("img").error(function() {
        broken_url = $(this).attr("src");
        var l = 0;
        for (var i = 0; i < images.length; i++) {
            if (images[i].indexOf(broken_url) != -1) {
                break;
            }
        }
        var url = images[i][Math.floor(Math.random() * images[i].length)];
        $(this).attr("src", url);
    });
    $("select").masonry({
        itemSelector: 'option',
        columnWidth: 400
    });
    $("#select_button").show();
    document.getElementById('services').scrollIntoView();
}

function displayPun() {
    var opts_urls = $("select").map(function(idx, el) {
        return this.options[this.value].dataset.imgSrc;
    }).get();
    var select = document.createElement('select');
    select.id = "select_final_list"
    select.className = "image-picker show-html";
    var emptyOpt = document.createElement("option")
    emptyOpt.setAttribute("value", "");
    select.appendChild(emptyOpt)
    var k = 1;
    opts_urls.forEach(function(url) {
        var imgContainer = document.createElement('option');
        imgContainer.dataset.imgSrc = url;
        imgContainer.setAttribute("value", k);
        k += 1;
        select.appendChild(imgContainer);
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
        name.innerHTML = words[i];
        url.appendChild(name);
        var btn_id = "clip_btn" + i
        var input = document.createElement("input");
        input.className = "input_final_list"
        input.id = btn_id;
        input.setAttribute("value", opts_urls[i]);
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
    $(select).imagepicker();
    $("#select_button").hide();
}

function search() {
    random_search = false;
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
        imageSearch.setRestriction(
          google.search.Search.RESTRICT_SAFESEARCH,
          google.search.Search.SAFESEARCH_STRICT
        );
        imageSearch.execute(word);
    }
}

function searchLucky() {
    random_search = true;
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
        imageSearch.setSearchCompleteCallback(this, searchCompleteLucky, [imageSearch, i]);
        imageSearch.setRestriction(
            google.search.ImageSearch.RESTRICT_IMAGESIZE,
            google.search.ImageSearch.IMAGESIZE_MEDIUM);
        imageSearch.setRestriction(
          google.search.Search.RESTRICT_SAFESEARCH,
          google.search.Search.SAFESEARCH_STRICT
        );
        imageSearch.execute(word);
    }
}

function displayFlipPun() {
    if (random_search) {
        displayRandomPun();
    } else {
        displayPun();
    }
}

function OnLoad() {
    // Include the required Google branding
    google.search.Search.getBranding('branding');
}
