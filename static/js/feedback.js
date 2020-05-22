$(document).ready(function () {

    // Add the button functionality
    $('.card-button').on('click', function () {

        var $this = $(this);

        // Remove form if there is any

        if ($this.data('clicked')) {

            var text = $('textarea').val();
            $this.parent().children('.feedform').remove();


            if (text !== '') {

                // Send some data
                $.post('/feedback', {
                    feedback: text,
                    conceptId: conceptId
                });

                console.log("Posted");
            }

            $this.data('clicked', false);

        } else {

            // Get some data
            $.get('/feedback/count', { conceptId: conceptId })
                .done((data) => {
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
                        <span class="new badge blue" data-badge-caption="Feedbacks">${data.length}</span></a>
                  </form>
              </div>
          `);


                    var rows = '';

                    // Set the feedbacks on the modal
                    $.map(data, (item, index) => {

                        rows += `<tr>
              <td>${item[0]}</td>
              <td>${item[1]}</td>
              <td>${item[2]}</td>
              </tr>`;

                    });

                    var table = `<table>
          <thead>
            <tr>
                <th>ConceptId</th>
                <th>Message</th>
                <th>Date</th>
            </tr>
          </thead>
  
          <tbody>
            ${

                        rows

            }
          </tbody >
        </table > `;


                    // Add table to modal
                    $('#feedback-modal .modal-content').children().remove();
                    $('#feedback-modal .modal-content').append(table);

                    $this.data('clicked', true);

                });
        }

    });
});