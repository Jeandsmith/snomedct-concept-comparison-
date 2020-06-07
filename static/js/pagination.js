function mapResultItems(gatheredTerms, progress) {

    let col = $("span#collection-item-section");
    let arrGatheredTerms = $.makeArray(gatheredTerms);
    let resultLength = arrGatheredTerms.length;
    let pageLengthLimit = 8;
    let p = Math.ceil(resultLength / pageLengthLimit);
    let numOfPages = p;
    let paginationSection = $('.pagination #page-section');
    let views = $('div#view').children();
    let thereIsViews = views.length;

    progress.empty();
    col.empty();
    paginationSection.empty();
    arrGatheredTerms.sort(compareValues('Similarities', 'desc'));

    for (let page = 1; page <= numOfPages; page++) {

        col.append(`<span id="${page}"></span>`);
        let currentPage = $(`span#${page}`);

        for (let resultItemIdx = 0; resultItemIdx < pageLengthLimit; resultItemIdx++) {

            if (!arrGatheredTerms.length) break;

            let term = arrGatheredTerms.shift();
            let html = '';

            if (thereIsViews) {

                $.map(views, view => {

                    let re = /\d+\s/;
                    let viewId = view.attributes.id.value;
                    let cI = view.innerText.match(re)[0].trim();
                    let concept = view.innerText.match(/(<=\d+\s|\s)[a-zA-Z\s]+\n+\b/)[0].trim();

                    if (term.Term === concept && term.conceptId === cI) {

                        html = `
                            <a href="#!" class="collection-item active" id="${viewId}"truncate>
                                <p class="content">
                                <span class="term" data-conceptid=${term.conceptId}>
                                    ${term.Term} </span> <br>
                                <span class="similarity"> TFIDF-Similarity Score: ${term.Similarities}
                                </span></p>
                            </a>`;

                    }

                });


                if (html === '') {

                    html = `
                        <a href="#!" class="collection-item" truncate>
                            <p class="content">
                            <span class="term" data-conceptid=${term.conceptId}>
                                ${term.Term} </span> <br>
                            <span class="similarity"> TFIDF-Similarity Score: ${term.Similarities}
                            </span></p>
                        </a>`;

                }

            } else {

                html = `
                    <a href="#!" class="collection-item" truncate>
                    <p class="content">
                    <span class="term" data-conceptid=${term.conceptId}>
                        ${term.Term} </span> <br>
                    <span class="similarity"> TFIDF-Similarity Score: ${term.Similarities}
                    </span></p>
                    </a>`;

            }

            currentPage.append(html);

        }

        if (page === 1) {

            paginationSection.append(`<li class="active ${page}"><a href="#!">1</a></li>`);

        } else {

            paginationSection.append(`<li class="waves-effect ${page}"><a href="#!">${page}</a></li>`);
            currentPage.prop('hidden', true);

        }

    }

    M.toast({
        html: ["Returned Results: ", resultLength].join(' ')
    });

    if ($('span#page-section').children().length === 1) $('ul.pagination li.chev').addClass('disabled');
    else {

        $('ul.pagination li.chev').removeClass('disabled');
        $('ul.pagination li#left-chev').addClass('disabled');

    }

    pageAddEventListener();
    chevronEvent();
    loadItemClickEvent();
}

// Pagination button event

function pageAddEventListener() {
    $('ul.pagination span#page-section li').on('click', function () {

        let thisPage = $(this);
        let thisPageNumber = thisPage.children().text();
        let unActiveResultPage = $(`span#collection-item-section span#${thisPageNumber}`);
        let activePage = $('ul.pagination span#page-section li.active');
        let activePageNumber = activePage.children().text();
        let activeResultList = $(`span#collection-item-section span#${activePageNumber}`);

        if (activePageNumber !== thisPageNumber) {

            activePage.removeClass('active');
            activeResultList.prop('hidden', true);
            activeResultList.addClass('hidden');

            thisPage.addClass('active');
            thisPage.removeClass('waves-effect');
            unActiveResultPage.prop('hidden', false);

        }

    });
}

function chevronEvent() {

    // Functionality of chevron
    $('ul.pagination li.chev').on('click', function () {

        let currentPage = $('span#page-section li.active');
        let currentPageNumber = parseInt(currentPage.children().text());
        let currentVisiblePage = $(`span#collection-item-section span#${currentPageNumber}`);
        let numOfPages = $('span#page-section').children().length;
        let chevron = $(this);

        if (chevron.attr('id') === 'left-chev' && !chevron.hasClass('disabled')) {

            let rightChev = $('ul.pagination li#right-chev');

            if (rightChev.hasClass('disabled')) rightChev.removeClass('disabled');

            currentPageNumber -= 1;

            if (currentPageNumber >= 1) {

                currentVisiblePage.prop('hidden', true);
                currentPage.removeClass('active');

                let newActiveResultPage = $(`span#collection-item-section span#${currentPageNumber}`);
                let newPage = $(`span#page-section li.${currentPageNumber}`);

                newActiveResultPage.prop('hidden', false);
                newPage.addClass('active');

                if (currentPageNumber === 1) {

                    currentPage = 1;
                    chevron.addClass('disabled');

                }

            }

        } else if (chevron.attr('id') === 'right-chev' && !chevron.hasClass('disabled')) {

            let leftChev = $('ul.pagination li#left-chev');

            if (leftChev.hasClass('disabled')) leftChev.removeClass('disabled');

            currentPageNumber += 1;

            if (currentPageNumber <= numOfPages) {

                currentVisiblePage.prop('hidden', true);
                currentPage.removeClass('active');

                let newActiveResultPage = $(`span#collection-item-section span#${currentPageNumber}`);
                let newPage = $(`span#page-section li.${currentPageNumber}`);

                newActiveResultPage.prop('hidden', false);
                newPage.addClass('active');

                if (currentPageNumber === numOfPages) {

                    currentPage = numOfPages;
                    chevron.addClass('disabled');

                }

            }

        }

    });

}