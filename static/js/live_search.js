// Getting export function from cp module

$(() => {

  $("div.input-field input#search").keyup($.debounce(800, event => {

    // Get the length of the input
    var len = event.currentTarget.value.length;

    // Only make a request to the server if the input is at least 3 chars long
    if (len >= 3) {

      //  Show indetermined progress
      var progress = $("div#p-container");

      progress.empty();
      progress.append(`
            <div class="progress" style="margin-top: 0px; height: 5px;">
                <div class="indeterminate"></div>
            </div>`);

      var col = $("span#collection-item-section");
      var filterForm = $("div#filter-form");

      filterForm.empty();
      col.empty();

      $.ajax({
        url: "/term-search",
        contentType: "application/json",
        data: {
          search: event.currentTarget.value
        },
        method: "get",
        success: gatheredTerms => {

          progress.empty();

          // Covert the jsonp to an array
          var arrGatheredTerms = $.makeArray(gatheredTerms);
          arrGatheredTerms.sort(compareValues('Similarities', 'desc'));

          let tags = [];

          $.map(arrGatheredTerms, (term, index) => {

            if (!tags.includes(term.Tag)) {

              tags.push(term.Tag);

              let t = (term.Tag === "0") ? "No tag" : term.Tag;

              filterForm.append(`
              <p>
                <label>
                    <input name="group1" type="radio"/>
                    <span class="term_tag"> ${t} </span>
                </label>
              </p>`
              );
            }

          });

          loadRadioClicks();
          mapResultItems(gatheredTerms, progress);
          
        }
      });
    }
  }));
});
