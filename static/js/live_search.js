// Getting export function from cp module

$(() => {

  $("div.input-field input").keyup($.debounce(800, event => {
    
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
            </div>`);

      // Get where the results will display
      var col = $("span#collection-item-section");

      // Where the filter will be displayed
      var filterForm = $("div#filter-form");
      filterForm.children().remove();

      // Remove all previous children
      col.children().remove();

      // Make the request to the server for terms
      var jqxhr = $.ajax({
        url: "/term-search",
        contentType: "application/json",
        data: {
          search: event.currentTarget.value
        },
        method: "get",
        success: gathered_terms => {
          // Eliminate the previous results
          progress.children().remove();

          // Covert the jsonp to an array
          var arr = $.makeArray(gathered_terms);
          // console.log(typeof arr[0].Tag);

          // Sort the data by similarity
          arr.sort(compareValues('Similarities', 'desc'));

          let tags = [];

          $.map(arr, (term, index) => {

            if (!tags.includes(term.Tag)) {
              tags.push(term.Tag);

              let t = (term.Tag === "0") ? "No tag" : term.Tag;

              // Add the filter section
              filterForm.append(`
              <p>
                <label>
                    <input name="group1" type="radio"/>
                    <span class="term_tag"> ${t} </span>
                </label>
              </p>`
              );
            }

            var html = `
            <a href="#!" class="collection-item" truncate>
              <p class="content">
                <span class="term" data-conceptid=${term.conceptId}>
                  ${term.Term} </span> <br>
                <span class="similarity"> TFIDF-Cosine Similarity: ${term.Similarities}
                </span>
              </p>
            </a>
            
            `;
            col.append(html);
          });

          M.toast({
            html: ["Returned Results: ", arr.length].join(' ')
          });

          loadItemClickEvent();
          loadRadioClicks();
        },
        async: true
        // timeout: 3000
      });
    }
  }));
});
