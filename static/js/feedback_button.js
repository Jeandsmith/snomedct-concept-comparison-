$(() => {
    $('button#feedback_button').on('click', function () {

        // console.log($(this));
        let form = $('form#feedback_form');
        let concept = form
            .children()
            .children()
            .children('input#concept')
            .val();
        let conceptId = form
            .children()
            .children()
            .children('input#conceptId').val();
        let email = form
            .children()
            .children()
            .children('input#user-email').val();
        let username = form
            .children()
            .children()
            .children('input#user-name').val();
        let feedback = form
            .children()
            .children('textarea#textarea').val();

        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        
        if (email === '') M.toast({html: 'No Email Was Given'});
        else if (!regex.test(email)) M.toast({html: 'Bad Email Formatting'});
        else if (feedback === '') M.toast({html: 'No Feedback Was Given'});
        else if (feedback.length > 60) M.toast({html: 'Feedback Is Too Long'});
        else {
            $.post('/feedback', {
                'concept': concept,
                'conceptId': conceptId,
                'email': email,
                'username': username,
                'feedback': feedback
            }).done(function () {
                M.toast({html: 'Feedback submitted'});
                
                let formModal = $('#feedback-form.modal');
                let modalInstance = M.Modal.getInstance(formModal);
                modalInstance.close();
            });
        }


    });
});