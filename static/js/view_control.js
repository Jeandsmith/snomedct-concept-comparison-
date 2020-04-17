// Begin an ID counter -- to keep track of current view ID
// this -- refers to the thing I am clicking

// var prevClickedItems = [];
// var thisItemId = { ID: undefined, Term: undefined }; // Just for init
var newestItemId = 0;


function newItemView(term, conceptId, sim, id, terms) {

  // TODO: Organize the terms in the list
  // TODO: Fix order of list with the fsn on top

  var li = '';
  $.map(terms, term => {
    li += `<span class="tiny material-icons">lens</span> 
      ${term.Term} | 
      <span class="tooltipped" data-position="top" data-tooltip="Cosine similarity against the clicked term">${term.Similarities} </span> <br>`;
  });

  var item = ` 
      <div class="col s6" id="${id.toString()}">
        <div class="card hoverable theme">
          <div class="card-content">
            <span class="card-title tooltipped" data-position='top' data-tooltip="Cosine similarity of clicked term against the query">${conceptId} | ${term}</span>
            <p> ${sim}: Against Query</p>
            <br>
            <p>
            ${
              li
            }
            </p>
          </div>
        </div>
      </div>`;

  $(document).ready(function () {
    $('.tooltipped').tooltip();
  });


  return item;
}

function loadItemClickEvent() {

  // Select all collection items and assign a click event
  $("a.collection-item").on("click", function () {

    var thisItem = $(this);
    var term;
    var viewSection = $("div#view");

    term = thisItem.children().children("span.term").text();
    sim = thisItem.children().children("span.similarity").text();
    conceptId = thisItem.children().children("span.term").attr('data-conceptid');

    // Get the synonism
    $.ajax({
      url: '/descriptions',
      method: 'get',
      data: { id: conceptId, query: term },
      contentType: 'application/json',
      cache: false,
      async: true,
      success: terms => {

        // If there is nothing on the screen
        if (!viewSection.children().length) {

          newestItemId = 0;
          viewSection.append(newItemView(term, conceptId, sim, newestItemId, terms));
          thisItem.attr('id', newestItemId.toString());
          thisItem.data('onScreen', true);
        }

        // If there is a item on the screen and this item is not clicked yet
        else if (!thisItem.data('onScreen') && viewSection.children().length) {

          // Gen the id of this item
          newestItemId = (newestItemId + 1) % 2;

          // If the view section has something with this ID
          if (viewSection.children(`div#${newestItemId.toString()}`).length) {
            viewSection.children(`div#${newestItemId.toString()}`).remove();

            var prevItem = $('span#collection-item-section').children(`a#${newestItemId.toString()}`);
            prevItem.removeAttr('id');
            prevItem.data('onScreen', false);
          }

          viewSection.append(newItemView(term, conceptId, sim, newestItemId, terms));

          // Association of this item to the view item
          thisItem.attr('id', newestItemId.toString());
          thisItem.data('onScreen', true);
        }

        else if (thisItem.data('onScreen')) {
          var itemId = thisItem.attr(`id`);

          viewSection.children(`div#${itemId.toString()}`).remove();

          if (itemId == newestItemId) {
            newestItemId = (newestItemId + 1) % 2;
          }

          thisItem.data('onScreen', false);
          thisItem.removeAttr('id');
        }
      }
    });
  });
}
