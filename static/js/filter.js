function loadRadioClicks() {
    $('div#filter-form p label span.term_tag').on('click', function () {

        // Tag and query
        var val = $(this).text();
        var q = $("div.input-field input").val();

        //  Show indetermined progress
        var progress = $("div#p-container");

        // Remove the previous displayed results
        progress.empty();

        // Append to the DOM
        progress.append(`
            <div class="progress" style="margin-top: 0px; height: 5px;">
                <div class="indeterminate"></div>
            </div>`);

        $.ajax({
            url: "/filter",
            contentType: "application/json",
            data: {
                tag: val,
                query: q
            },
            method: "get",
            cache: true,
            success: gatheredTerms => {

                mapResultItems(gatheredTerms, progress);

            },
        });
    });
}