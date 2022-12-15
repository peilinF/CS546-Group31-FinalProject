(function ($) {
    var myForm = $('#myForm'),
        passwordInput = $('#passwordInput'),
        confirmPasswordInput = $('#confirmPasswordInput'),
        mySpan = $('#message'),
        myError = $('#error'),
        username = $('#usernameInput'),
        email = $('#emailInput'),
        birthDate = $('#birthDateInput'),
        questionA = $('#questionsA'),
        answer1 = $('#answerInput1'),
        questionB = $('#questionsB'),
        answer2 = $('#answerInput2');
        errorMessage = $('#errorMessage');
        errorSpan = $('#message');
    myForm.submit(function (e) {
        e.preventDefault();
        if ( passwordInput.val() === '' || confirmPasswordInput.val() === '' || username.val() === '' || email.val() === '' || birthDate.val() === '' || questionA.val() === '' || answer1.val() === '' || questionB.val() === '' || answer2.val() === ''){
            errorMessage.css('color', 'red');
            errorMessage.html('Please fill all the fields!');
            return;
        }
        else if(questionA.val() === questionB.val()){
            errorMessage.css('color', 'red');
            errorMessage.html('Secure questions could not be the same!');
            return;
        } else if (passwordInput.val() !== confirmPasswordInput.val() && passwordInput.val() !== '' && confirmPasswordInput.val() !== '') {
            errorMessage.html('');
            mySpan.css('color', 'red');
            mySpan.html('not matching');
        } else {
            mySpan.css('color', 'green');
            mySpan.html('matching');
            var requestConfig = {
                method: 'POST',
                url: '/register',
                contentType: 'application/json',
                data: JSON.stringify({
                    username: $('#usernameInput').val(),
                    email: $('#emailInput').val(),
                    birthDate: $('#birthDateInput').val(),
                    password: $('#passwordInput').val(),
                    questionA:$('#questionsA option:selected').text(),
                    answer1: $('#answerInput1').val(),
                    questionB: $('#questionsB option:selected').text(),
                    answer2:$('#answerInput2').val()
                }),
                error: function (err) {
                    errorMessage.css('color', 'red');
                    errorMessage.html(err.responseText);
                }
            }
            
            $.ajax(requestConfig).then(function (responseMessage) {
                myError.html('');
                window.location.href = '/login';
            });

        }
    });
})(window.jQuery);
