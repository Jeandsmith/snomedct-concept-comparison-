function loadRadioClicks() {
    $('div#filter-form p label span.term_tag').on('click', function () {
        // Tag and query
        var val = $(this).text();
        var q = $("div.input-field input").val();

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

        // Remove all previous children
        col.children().remove();

        $.ajax({
            url: "/filter",
            contentType: "application/json",
            data: {
                tag: val,
                query: q
            },
            method: "get",
            cache: true,
            success: gathered_terms => {

                // Eliminate the previous results
                progress.children().remove();

                // Covert the jsonp to an array
                var arr = $.makeArray(gathered_terms);
                // console.log(typeof arr[0].Tag);

                // Sort the data by similarity
                arr.sort(compareValues('Similarities', 'desc'));
                
                // console.log(arr);

                $.map(arr, (term, index) => {

                    var html = `
                        <a href="#!" class="collection-item" truncate>
                        <p class="content">
                        <span class="term" data-conceptid=${term.conceptId}>
                            ${term.Term} </span> <br>
                        <span class="similarity"> Similarity Score: ${term.Similarities}
                        </span></p>
                        </a>
                    `;
                    col.append(html);
                });

                M.toast({
                    html: ["Returned Results: ", arr.length].join(' ')
                });

                loadItemClickEvent();
            },
            async: true
            // timeout: 3000
        });
    });
}