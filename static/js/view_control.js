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

            <div class="row attr-card">
              <div class="col s12 m12">
                <div class="card blue darken-3">
                  <div class="card-content white-text">
                    <p class="grey-text light-1">Concept hierarchal Attribute</p>
                    </br>
                    <span id="rels"> 
                    
                    
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <a class="modal-trigger waves-effect waves-white white-text btn-flat card-button tooltipped" data-position="right" data-tooltip="See something wrong with the concept? Send feedback" href="#feedback-form">Feedback</a>

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

      $.map(termsRes, term => {

        if (term.Typeid === '900000000000003001') lo += ` <h6> ${term.Term}</h6> <br> `;
        else li += `<span><i class="tiny material-icons">lens</i> ${term.Term} </span> <br>`;

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

      if (thisItem.hasClass('active')) {

        removeItemView(thisItem, viewSection);

      } else {

        newestItemId = (newestItemId + 1) % 2;

        ajaxConceptSynRequest(conceptId);

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

    }

    else if (thisItem.data('onScreen')) {

      removeItemView(thisItem, viewSection);

    }

    addButtonClickEven();

    $('.tooltipped').tooltip();

  });

}

function removeItemView(item, viewSection) {

  let itemId = item.attr(`id`);

  item.removeClass("active");
  viewSection.children(`div#${itemId.toString()}`).remove();

  if (itemId == newestItemId) {
    newestItemId = (newestItemId + 1) % 2;
  }

  item.data('onScreen', false);
  item.removeAttr('id');
  $('#concept-cosine-sim').text(0);

}

function addButtonClickEven() {

  $('.card-button').on('click', function () {

    let $this = $(this);
    let concept = $this.parent().children('span').children('.card-concept').text();
    let conceptId = $this.parent().children('span').children('#conceptId').text();

    // console.log(concept);

    if ($this.data('clicked')) {

      // let text = $this.parent()
      //   .children('div.feedform')
      //   .children('form.feedback')
      //   .children('div.row')
      //   .children('div.input-field')
      //   .children('textarea#textarea1').val();

      // if (text !== '') {

      //   $.post('/feedback', {
      //     feedback: text,
      //     conceptId: concept
      //   });

      // }

      $this.parent().children('div.feedform').remove();
      $this.removeData('clicked');
      $this.removeAttr('href');

    } else {

      $.get('/feedback/count', { conceptId: conceptId }).done(data => {

        let rows = '';

        $.map(data, (item, index) => {

          rows += `<tr>
          <td>${item[0]}</td>
          <td>${item[1]}</td>
          <td>${item[2]}</td>
          </tr>`;

        });

        $this.parent()
          .children('div.feedform')
          .children()
          .children('span.feedbacks')
          .append(`${data.length}`);

        // $('a.feedback-modal-button').on('click', function () {
        //   $('#feedback-modal .modal-content table tbody').append(rows);
        // });
        $('#feedback-modal .modal-content table tbody').append(rows);

      });

      $this.parent().append(`
      <div class="row feedform">
        <div class="col s2">
          <a class="modal-trigger btn-floating blue darken-2 pulse feedback-modal-button scale-transition" href="#feedback-modal">
              <i class="material-icons">chrome_reader_mode</i>
          </a>
        </div>

        <div class="col s10">
          <span class="new badge blue feedbacks align-center" data-badge-caption="User Feedback"></span>
        </div>
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
      $('#feedback-form input, textarea').val('');
      $('#feedback-form input#concept').val(concept.toString().trim());
      $('#feedback-form input#conceptId').val(conceptId);
      M.updateTextFields();
      $this.attr('href', '#feedback-form');
      $this.data('clicked', true);
      $('.modal').modal();
    }
  });


  $('.tooltipped').tooltip();
  $('textarea#textarea').characterCounter();
}
