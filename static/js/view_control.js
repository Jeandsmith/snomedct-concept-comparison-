// Begin an ID counter -- to keep track of current view ID
// this -- refers to the thing I am clicking

// var prevClickedItems = [];
// var thisItemId = { ID: undefined, Term: undefined }; // Just for init
var newestItemId = 0;


function newItemView(term, conceptId, sim, id, terms) {

  var li = '';
  $.map(terms, term => {
    if (term.Typeid === '900000000000003001') {
      li += ` 
      <h4 class=""> ${term.Term}  | </h5>
      <h5 class="flex"> 
        <span class="tooltipped" data-position="top" data-tooltip="Cosine similarity against the clicked term">
          ${parseFloat(term.Similarities).toFixed(3)}</span> </h6><br>`;
    } else {
      li += `<span class="tiny material-icons">lens</span> 
      ${term.Term} </span> <br>`;
    }
  });

  var item = ` 
      <div class="col s6" id="${id.toString()}">
        <div class="card hoverable theme">
          <div class="card-content">
            
            <span class="card-title tooltipped" data-position='top' data-tooltip="TFIDF weighted similarity against user query."> <span id="conceptId">${conceptId}</span> | ${term}</span>
            <p> TFIDF| ${sim}</p>
            <br>
            <p>
            ${
    li
    }
            </p>

            <a class="waves-effect waves-white white-text btn-flat card-button tooltipped" data-position="right" data-tooltip="See something wrong with the concept? Send feedback">Feedback</a>

          </div>
        </div>
      </div>`;

    $('.card-button').unbind();

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
    // $('div.feedform').remove();

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
          $(this).addClass('active');
          thisItem.data('onScreen', true);

        }

        // If there is a item on the screen and this item is not clicked yet
        else if (!thisItem.data('onScreen') && viewSection.children().length) {

          // Gen the id of this item
          newestItemId = (newestItemId + 1) % 2;

          // If the view section has something with this ID
          if (viewSection.children(`div#${newestItemId.toString()}`).length) {

            // viewSection.children(`div#${newestItemId.toString()}`).children('div.feedform').remove();
            // $('.card-button').removeData();

            viewSection.children(`div#${newestItemId.toString()}`).remove();

            var prevItem = $('span#collection-item-section').children(`a#${newestItemId.toString()}`);
            prevItem.removeClass("active");
            prevItem.removeAttr('id');
            prevItem.data('onScreen', false);
          }

          viewSection.append(newItemView(term, conceptId, sim, newestItemId, terms));
          thisItem.addClass("active");


          // Association of this item to the view item
          thisItem.attr('id', newestItemId.toString());
          thisItem.data('onScreen', true);
        }

        else if (thisItem.data('onScreen')) {

          var itemId = thisItem.attr(`id`);

          thisItem.removeClass("active");
          viewSection.children(`div#${itemId.toString()}`).children('a.card-button').remove();
          viewSection.children(`div#${itemId.toString()}`).remove();

          if (itemId == newestItemId) {
            newestItemId = (newestItemId + 1) % 2;
          }

          thisItem.data('onScreen', false);
          thisItem.removeAttr('id');
        }

        $('.tooltipped').tooltip();
        addButtonClickEven();
      }
    });
  });
}

function addButtonClickEven() {

  // Add the button functionality
  $('.card-button').on('click', function () {

    var $this = $(this);
    var concept = $this.parent().children('span').children('#conceptId').text();
    // var thisCardId = $this.parent().parent().parent().attr('id');

    // Remove form if there is an
    if ($this.data('clicked')) {

      var text = $this.parent().children('div.feedform').children('form.feedback')
        .children('div.row').children('div.input-field').children('textarea#textarea1').val();

      if (text !== '') {

        $.post('/feedback', {
          feedback: text,
          conceptId: concept
        });

      }

      $this.parent().children('div.feedform').remove();
      $this.removeData('clicked');
      console.log('Removed form ');

    } else {

      // Get some data
      $.get('/feedback/count', { conceptId: concept }).done(data => {

        var rows = '';

        // Set the feedbacks on the modal
        $.map(data, (item, index) => {

          rows += `<tr>
          <td>${item[0]}</td>
          <td>${item[1]}</td>
          <td>${item[2]}</td>
          </tr>`;

        });

        // Append the length of data to 
        $this.parent().children('div.feedform').children('form.feedback').children('a').children('span').append(`${data.length}`);

        // Append the table row
        $('#feedback-modal .modal-content table tbody').append(rows);

      });

      $this.parent().append(`
      <div class="row feedform">
          <form class="col s12 feedback">
              <div class="row">
                  <div class="input-field col s12">
                  <textarea id="textarea1" class="materialize-textarea"></textarea>
                  <label for="textarea1">Write Feedback</label>
                  </div>
              </div>

              <a class="modal-trigger" href="#feedback-modal">
                <span class="new badge blue feedbacks" data-badge-caption="Feedbacks"></span></a>
          </form>
      </div>`);

      var table = `<table>
      <thead>
        <tr>
            <th>ConceptId</th>
            <th>Message</th>
            <th>Date</th>
        </tr>
      </thead>
      <tbody>
      </tbody >
      </table >`;


      // Add table to modal
      $('#feedback-modal .modal-content').children().remove();
      $('#feedback-modal .modal-content').append(table);

      $this.data('clicked', true);
      console.log('Added form');

    }
  });

}
