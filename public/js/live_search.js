$(() => {

  $("div.input-field input").keyup(event => {
    
    //  Show indetermined progress
    var progress = $("div#p-container");

    progress.children().remove();

    progress.append(`
            <div class="progress" style="margin-top: 0px; height: 5px;">
                <div class="indeterminate"></div>
            </div>`
    );

    // Get where the results will display
    var col = $('span#collection-item-section');
        
    // Remove all previous children
    col.children().remove();


    // console.log(progress);

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
        
        $.map(arr, (term, index) => {

          var html = [
            '<a href="#!" class="collection-item" truncate>',
              '<p class="content">',
                '<span class="term">', term.sct_term, '</span> <br>',
                '<span class="similarity"> Similarity Score:', term.similarity , "</span></p>",
            "</a>"
          ];
          col.append(html.join(''));
        });

        loadItemClickEvent();
      },
      async: true
    });
  });

});
