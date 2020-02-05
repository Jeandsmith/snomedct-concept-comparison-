(function () {
    $("table tbody tr td a").on("click", function () {
        if ($(this).data('clicked')) {
            // Erase this card
            var cardID = $(this).attr("id");
            $("div#" + cardID).detach();
            console.log("#" + cardID);
            $(this).data('clicked', false);

        } else {
            var td = $("table tbody tr td");

            //TODO: Assing cid and description to the card panel
            var cid = td.attr("");
            
            // Open detail card 
            htmlTag = [
                "<div class=\"col s12 m6\" id=\"", $(this).attr('id'), "\">",
                    "<div class=\"card blue-grey darken-1\">",
                        "<div class=\"card-content white-text\">",
                        "<span class=\"card-title\"> ", $(this).attr('id'), "</span>",
                        "<div class=\"divider\"></div>",
                            "<ul>",
                                "<li>",
                                    "<p>Description</p>",
                                    "<p><% description %></p>",
                                "</li>",
                                "<br>",
                                "<li>",
                                    "<p>Similarity Score With Search Query</p>",
                                    "<p><% similarity_grade %></p>",
                                "</li>",
                            "</ul>",
                        "</div>",
                    "</div>",
                "</div> "
            ];

            $('div.card-row').append(htmlTag.join(''));
            $(this).data('clicked', true);
        }
    });
})();