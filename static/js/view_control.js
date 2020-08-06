// Begin an ID counter -- to keep track of current view ID
// this -- refers to the thing I am clicking

// let prevClickedItems = [];
// let thisItemId = { ID: undefined, Term: undefined }; // Just for init
var newestItemId = 0;

function newItemView(term, conceptId, id) {

  let item = ` 
      <div class="col s6" id="${id.toString()}">
        <div class="row">
          <div class="col s12">

            <ul class="tabs">

              <li class="tab col s4"><a href="#${id.toString()}_summary" class="active">Summary</a></li>
              <li class="tab col s4"><a href="#${id.toString()}_parent">Parents</a></li>
              <li class="tab col s4"><a href="#${id.toString()}_child">Childrens</a></li>

            </ul>

          </div>

          <div id="${id.toString()}_summary" class="col s12">
            
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
          </div>

          <div id="${id.toString()}_parent" class="col s12">
            <div class="card hoverable theme">
              <div class="card-content">
                
              </div>
            </div>
          </div>
        </div>

        <div id="${id.toString()}_child" class="col s12">
            <div class="card hoverable theme">
              <div class="card-content">
                
              </div>
            </div>
          </div>
        </div>
      </div>`;

  $('.card-button').unbind();

  // Initialized tabs
  $(() => {
    $('.tabs').tabs();
  });

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

      let currentCardSyn = $(`div#view div#${newestItemId} div#${newestItemId}_summary p.card-syn`);

      currentCardSyn
        .children('.fns')
        .append(`${lo}`);
      currentCardSyn
        .children('.syn')
        .append(`${li}`);

      let currentCardRels = $(`div#view div#${newestItemId} div#${newestItemId}_summary div.attr-card`);
      currentCardRels
        .children()
        .children()
        .children()
        .append(`${r}`);

      // get the parents

      getConceptParents(conceptId); 

    }
  });

}

// Get the parent concepts of the clicked concepts
function getConceptParents(conceptId) {

  $.get('/descriptions/parent-rels', { 'conceptId': conceptId }).done(function (parents) {

    // Get ref to card with this concept
    var cardView = $(`#${newestItemId}_parent`)
      .children();

    var cardContent = cardView.children("div div.card-content");
    var lis = "";

    if (parents.length) {
      $.map(parents, parent => {
        lis += `<span><i class="tiny material-icons">lens</i> ${parent.Concept} </span> <br>`;
      });
    }else lis = "No parents.";

    cardContent.append(lis.toString());
    getChildrenConcepts(conceptId);
  });

}

//! TODO: The request is not returning anything or sending anything
function getChildrenConcepts(conceptId) {
  $.get('/children-rels', { 'conceptId': conceptId })
    .done(function(children) {
      // Get ref to card with this concept
      var cardView = $(`#${newestItemId}_child`)
        .children();

      var cardContent = cardView.children("div div.card-content");
      var lis = "";

      if (children.length) {
        $.map(children, child => {
          lis += `<span><i class="tiny material-icons">lens</i> ${child.Concept} </span> <br>`;
        });
      }else lis = "No children.";

      console.log(children);

      cardContent.append(lis.toString());
    });
}

function loadItemClickEvent() {

  $("a.collection-item").on("click", function () {

    let thisItem = $(this);
    let term;
    let viewSection = $("div#view");

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

        console.log(`Term1: ${otherCardConcept}`);
        console.log(`Term2: ${term}`);

        $.post('/descriptions/card-concept-comparison', {
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

    if ($this.data('clicked')) {

      $this.parent().children('div.feedform').remove();
      $this.removeData('clicked');
      $this.removeClass('modal-trigger');

    } else {

      $.get('/feedback/count', { 'conceptId': conceptId }).done(data => {

        let dataBadge = $this
          .parent()
          .children('div.feedform')
          .children('div.s10')
          .children('span.feedbacks');

        dataBadge.text(`${data.length}`);

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

      feedButtonClickEvent();
      let modalInsts = $('.modal');
      M.Modal.init(modalInsts);
      $('#feedback-form input, textarea').val('');
      $('#feedback-form input#concept').val(concept.toString().trim());
      $('#feedback-form input#conceptId').val(conceptId);
      M.updateTextFields();
      if (!$this.hasClass('modal-trigger')) $this.addClass('modal-trigger');
      $this.data('clicked', true);

    }
  });

  $('.tooltipped').tooltip();
  $('textarea#textarea').characterCounter();

}

function feedButtonClickEvent() {

  $('a.feedback-modal-button').unbind();

  // Button to get the user feed back
  $('a.feedback-modal-button').on('click', function () {

    let $this = $(this);
    let conceptId = $this
      .parent()
      .parent()
      .parent()
      .children('span')
      .children('#conceptId')
      .text();

    $.get('/feedback/count', { conceptId: conceptId }).done(data => {

      let rows = '';

      $.map(data, (item, index) => {

        rows += `<tr>
      <td>${item[0]}</td>
      <td>${item[1]}</td>
      <td>${item[2]}</td>
      </tr>`;

      });

      let tbody = $('#feedback-modal .modal-content table tbody#tbody-content');
      tbody.empty();
      tbody.append(rows);

    });

  });
}
