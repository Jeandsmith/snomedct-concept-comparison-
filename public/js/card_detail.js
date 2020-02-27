(function () {
    $("div.collection a").on("click", function () {
        // Request score generation
        // $.ajax({
        //     url: "/gen_similarity_score",
        //     data: {
        //         thisTerm: "Some data",
        //         otherTerm: "Some other data"  
        //     },
        //     success: (data) => {
        //         console.log(data)
        //     }
        // })
        
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
                    "<div class=\"card blue-grey darken-1 hoverable\">",
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