$(initTimeline);

function initTimeline() {
    $.getJSON("https://jsonp.afeld.me/?url=https://spreadsheets.google.com/feeds/list/1PtY6JJcwyV1nSwwRfVi1VvinXXk-yq3VZpqSCRb4A8U/od6/public/values?alt=json", printItems);
    $("#timeline").on("click", "ul .item", checkItem);
}

function checkItem(e) {
    target = $(e.currentTarget).find(".item-container");
    if (parseInt(target.css("max-height")) > 40) {
        target.css("max-height", target.height());
        target.animate({
            maxHeight: 40
        });
    } else {
        showItem(e);
    }
}

function showItem(e) {
    var target = $(e.currentTarget).find(".item-container");
    closeItems();
    target.animate({
        maxHeight: 800
    });
}

function closeItems() {
    $("#timeline > ul > li > .item-container").each(function (k, v) {
        $(v).css({
            maxHeight: 40
        });
    });
}

function printItems(data) {
    var ul = $("<ul>");
    console.log(data);
    $.each(data.feed.entry, function (k, v) {
        var sources = "";
        if (v.gsx$sources.$t != "") {
            sources = $("<ul>").append(replaceURLWithHTMLLinks(v.gsx$sources.$t));
        }
        var li = $("<li>", {
            "class": "item"
        })
            .append($("<div>")
                .append($("<div>")
                    .append($("<span>", {
                        "text": v.gsx$year1.$t
                    }))
                    .append($("<span>", {
                        "text": v.gsx$year2.$t
                    }))))
                .append($("<div>", {
                    "class": "item-container"
                })
                    .append($("<h3>", {
                        "text": v.gsx$name.$t
                    }))
                    .append($("<span>", {
                        "text": v.gsx$date.$t
                    }))
                    .append($("<div>", {
                        "class": "item-image"
                    }).css("background-image", "url(\"" + v.gsx$image.$t + "\")"))
                    .append($("<p>", {
                        "text": v.gsx$description.$t
                    }))
                .append(sources).css("max-height", 0));
        ul.append(li);
    });
    $("#timeline ul").replaceWith(ul);
    closeItems();
}

function replaceURLWithHTMLLinks(text) {
    var exp = /(^|["'(\s]|&lt;)((?:(?:https?|ftp):\/\/|mailto:).+?)((?:[:?]|\.+)?(?:\s|$)|&gt;|[)"',])/g;
    return text.replace(exp,"$1<a href='$2' target='_blank'>$2</a>$3");
}