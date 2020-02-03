/**
 * When user clicks ancor,
 * Material CSS card_panel 
 * is created with concept info
 */

$('.concept').click(() => {

   if (jQuery($(this).attr('id')).data('clicked')){
      // This concept was clicked already
   }else{
      htmlTag = [
         "<div class=\"col s12 m6\">",
            "<div class=\"card blue-grey darken-1\">",
               "<div class=\"card-content white-text\">",
                  "<span class=\"card-title\">{{ concept }}</span>",
                  "<div class=\"divider\"></div>",
                  "<ul>",
                     "<li>",
                        "<p>Description</p>",
                        "<p>{{ description }}</p>",
                     "</li>",
                     "<br>",
                     "<li>",
                        "<p>Similarity Score With Search Query</p></li>",
                     "<p>{{ similarity_grade }}</p>",
                  "</ul>",
               "</div>",
            "</div>",
         "</div> "
      ];
   
      $('div.card-row').append(htmlTag.join(''));

      // This is now clicked
      $(this).data('clicked', true);
   }

});