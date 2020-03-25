$(() => {

  $("div.input-field input").keyup(event => {
    // Get the length of the input
    var len = event.currentTarget.value.length;
    // Only make a request to the server if the input is at least 3 chars long
    if (len >= 3) {
      //  Show indetermined progress
      var progress = $("div#p-container");
      // Remove the previous displayed results
      progress.children().remove();
      // Append to the DOM
      progress.append(`
            <div class="progress" style="margin-top: 0px; height: 5px;">
                <div class="indeterminate"></div>
            </div>`
      );

      // Get where the results will display
      var col = $('span#collection-item-section');

      // Remove all previous children
      col.children().remove();
      // Make the request to the server for terms
      $.ajax({
        url: "/term-search",
        contentType: "application/json",
        data: {
          search: event.currentTarget.value
        },
        method: "get",
        success: gathered_terms => {
          progress.children().remove();

          // Make the objects to an array
          var arr = $.makeArray(gathered_terms);

          // console.log(arr)

          $.map(arr, (term, index) => {

            var html = [
              '<a href="#!" class="collection-item" truncate>',
              '<p class="content">',
              '<span class="term">', term.Term, '</span> <br>',
              '<span class="similarity"> Similarity Score:', term.Similarities, "</span></p>",
              "</a>"
            ];
            col.append(html.join(''));
          });

          loadItemClickEvent();
        },
        async: true
        // timeout: 3000
      });
    }
  });

});
