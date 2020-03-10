// Begin an ID counter -- to keep track of current view ID

function loadItemClickEvent() {
  let c = 0;

  let prevTerms = [-1];

  // Select all collection items and assign a click event
  $("a.collection-item").on("click", function () {

    console.log('Clicked');

    // Grab the view section from the DOM
    var $this = $("div#view");

    // If this collection item has not been clicked
    if (!$(this).data("clicked")) {
      // Generate the ID of the new view
      var kc = c % 2;

      var term = $(this)
        .children()
        .children("span.term")
        .text();

      // Fix the id
      var termId = term.replace(/[\s,]+/g, "-");

      if (prevTerms.length > 1) {
        // Get the previous term id from hist
        var prevId = prevTerms.shift();

        // Get the oldest term by class id
        var prevTerm = $("." + prevId.toString());

        // Remove the previous view with oldest id
        $this.children("div." + prevId.toString()).remove();

        // Make oldest term not clicked
        prevTerm.data("clicked", false);

        // Now that is not clicked, removed the id class
        prevTerm.removeClass(prevId.toString());
      }

      // Generate the DOM Object
      // kc.toString() -- Converts the ID of this view to string object instead of int
      var html = [
        '<div class="col s6 ',
        kc.toString(),
        '" id="',
        termId,
        '">',
        "<h4>",
        term,
        "</h4>",
        '<div class="division"></div>',
        "<h5>Similarity</h5>",
        "<h4>Parents</h4>",
        "</div>"
      ];

      // Queue the # id
      prevTerms.push(kc);

      console.log(prevTerms);

      // Append the new (this) view to the DOM
      $this.append(html.join(""));

      // Update the term id # and set this collection-item to clicked
      $(this).data("clicked", true);

      $(this).data("id", termId);

      $(this).addClass(kc.toString());

      c = kc + 1;
    } else {
      // Delete the view and set the term to not cliked

      console.log("Deliting");

      $this.children("div#" + $(this).data("id")).remove();

      $(this).data("clicked", false);

      prevTerms.find();
    }
  });
};
