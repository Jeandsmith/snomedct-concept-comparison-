// Begin an ID counter -- to keep track of current view ID
// this -- refers to the thing I am clicking

// let prevClickedItems = [];
// let thisItemId = { ID: undefined, Term: undefined }; // Just for init
var newestItemId = 0;


function newItemView(term, conceptId, id) {

  let item = ` 
      <div class="col s6" id="${id.toString()}">
        <div class="card hoverable theme">
          <div class="card-content">
            <span class="card-title"> 
              <span id="conceptId">${conceptId}</span> | 
              <span class="card-concept">${term}</span>
            </span>
            <br>

            <p class="flex card-syn">
              
              <span class="fns"></span>
              <span class="syn"></span>

            </p>

            <div class="row attr-card tooltipped" data-position="top" data-tooltip="Concept Attributes>
              <div class="col s12 m12">
                <div class="card blue darken-3">
                  <div class="card-content white-text">
                    <span id="rels"> 
                    
                    
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <a class="waves-effect waves-white white-text btn-flat card-button tooltipped" data-position="right" data-tooltip="See something wrong with the concept? Send feedback">Feedback</a>

          </div>
        </div>
      </div>`;

  $('.card-button').unbind();

  return item;

}

function ajaxConceptSynRequest(conceptId) {
  $.ajax({
    url: '/descriptions',
    method: 'get',
    data: { id: conceptId },
    contentType: 'application/json',
    cache: false,
    async: true,
    success: terms => {

      let attrRels = terms.attr_rels;
      let termsRes = terms.search_result;
      let r = '';
      let li = '';
      let lo = '';

      console.log(attrRels);

      $.map(termsRes, term => {

        if (term.Typeid === '900000000000003001') lo += ` <h6> ${term.Term}</h6> <br> `;
        else li += `<span class="tiny material-icons">lens</span> ${term.Term} </span> <br>`;

      });

      if (attrRels.length) {
        $.map(attrRels, term => {

          r += `
          
            <span>${term.typeTerm} <i class="tiny material-icons">chevron_right</i> ${term.destTerm}</span></br>
          
          `;

        });
      } else {

        r = `
          
          <span>No Attributes</span> </br>
      
        `;

      }

      let currentCardSyn = $(`div#view div#${newestItemId} p.card-syn`);

      currentCardSyn
        .children('.fns')
        .append(`${lo}`);
      currentCardSyn
        .children('.syn')
        .append(`${li}`);

      let currentCardRels = $(`div#view div#${newestItemId} div.attr-card`);
      currentCardRels
        .children()
        .children()
        .children()
        .append(`${r}`);

    }
  });
}

function loadItemClickEvent() {

  $("a.collection-item").on("click", function () {

    let thisItem = $(this);
    let term;
    let viewSection = $("div#view");
    let pageRef = thisItem.parent().attr('id');

    term = thisItem.children().children("span.term").text();
    conceptId = thisItem.children().children("span.term").attr('data-conceptid');

    if (!viewSection.children().length) {

      ajaxConceptSynRequest(conceptId);
      newestItemId = 0;
      viewSection.append(newItemView(term, conceptId, newestItemId));
      thisItem.attr('id', newestItemId.toString());
      thisItem.addClass('active');
      thisItem.data('onScreen', true);
      thisItem.data('viewId', newestItemId);

    }

    else if (!thisItem.data('onScreen') && viewSection.children().length) {

      ajaxConceptSynRequest(conceptId);
      newestItemId = (newestItemId + 1) % 2;

      if (viewSection.children(`div#${newestItemId.toString()}`).length) {

        // Remove here
        // `span#${pageRef}`
        let prevItem = $('span#collection-item-section')
          .children().children(`a#${newestItemId.toString()}`);

        viewSection.children(`div#${newestItemId.toString()}`).remove();
        prevItem.removeClass("active");
        prevItem.removeAttr('id');
        prevItem.data('onScreen', false);
        prevItem.removeData('viewId');

      }

      let otherCardId = Math.abs(newestItemId - 1);
      let otherCardConcept = $(`div#view div#${otherCardId} .card .card-content .card-title .card-concept`).text();

      $.post('/description/card-concept-comparison', {
        'concept_1': otherCardConcept, 'concept_2': term
      }).done(sim => { $('#concept-cosine-sim').text(sim); });

      viewSection.append(newItemView(term, conceptId, newestItemId));
      thisItem.addClass("active");

      thisItem.attr('id', newestItemId.toString());
      thisItem.data('onScreen', true);
    }

    else if (thisItem.data('onScreen')) {

      let itemId = thisItem.attr(`id`);

      thisItem.removeClass("active");
      // viewSection.children(`div#${itemId.toString()}`).children('a.card-button').remove();
      viewSection.children(`div#${itemId.toString()}`).remove();

      if (itemId == newestItemId) {
        newestItemId = (newestItemId + 1) % 2;
      }

      thisItem.data('onScreen', false);
      thisItem.removeAttr('id');
      $('#concept-cosine-sim').text(0);
    }

    addButtonClickEven();

    $('.tooltipped').tooltip();

  });

}

function addButtonClickEven() {

  $('.card-button').on('click', function () {

    let $this = $(this);
    let concept = $this.parent().children('span').children('#conceptId').text();

    if ($this.data('clicked')) {

      let text = $this.parent().children('div.feedform').children('form.feedback')
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

      $.get('/feedback/count', { conceptId: concept }).done(data => {

        let rows = '';

        $.map(data, (item, index) => {

          rows += `<tr>
          <td>${item[0]}</td>
          <td>${item[1]}</td>
          <td>${item[2]}</td>
          </tr>`;

        });

        $this.parent().children('div.feedform').children('form.feedback').children('a').children('span').append(`${data.length}`);

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

      let table = `<table>
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

      $('#feedback-modal .modal-content').children().remove();
      $('#feedback-modal .modal-content').append(table);
      $('.modal').modal();

      $this.data('clicked', true);
    }
  });


  $('.tooltipped').tooltip();
}
