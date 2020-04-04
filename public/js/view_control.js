// Begin an ID counter -- to keep track of current view ID
// this -- refers to the thing I am clicking

// var prevClickedItems = [];
// var thisItemId = { ID: undefined, Term: undefined }; // Just for init
var newestItemId = 0;

function loadItemClickEvent() {

  // Select all collection items and assign a click event
  $("a.collection-item").on("click", function () {

    newItemView = "";
    var thisItem = $(this);
    var term;
    var viewSection = $("div#view");

    // If there is nothing on the screen
    if (!viewSection.children().length) {

      newestItemId = 0;
      term = thisItem.children().children("span.term").text();

      newItemView = ` 
      <div class="col s6" id="${newestItemId.toString()}">
        <h2 class="header">${term}</h2>
        <div class="card horizontal">
          <div class="card-stacked">
            <div class="card-content">
              <ul class="collection">
                <li class="collection-item"><i class="material-icons>lens</i>Alvin</li>
              </ul>
            </div>
          </div>
        </div>
      </div>`;

      viewSection.append(newItemView);
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
      }else console.log(`There is no item with this id. Adding this item.`);

      // Gen the identity of this item for the record
      term = thisItem.children().children("span.term").text();

      // Append the view to the screen
      newItemView = ` 
      <div class="col s6" id="${newestItemId.toString()}">
        <h2 class="header">${term}</h2>
          <div class="card horizontal">
            <div class="card-stacked">
              <div class="card-content">
                <ul class="collection">
                <li class="collection-item"><i class="material-icons>lens</i>Alvin</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      `;

      viewSection.append(newItemView);

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
  });
}
