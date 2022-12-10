(function ($) {
    var myForm = $('#myForm'),
        passwordInput = $('#passwordInput'),
        confirmPasswordInput = $('#confirmPasswordInput'),
        mySpan = $('#message'),
        myError = $('#error'),
        username = $('#usernameInput'),
        email = $('#emailInput'),
        birthDate = $('#birthDateInput'),
        questionA = $('#questionsA option:selected'),
        answer1 = $('#answerInput1'),
        questionB = $('#questionsB option:selected'),
        answer2 = $('#answerInput2');
        errorMessage = $('#errorMessage');
    myForm.submit(function (e) {
        e.preventDefault();
        if ( passwordInput.val() === '' || confirmPasswordInput.val() === '' || username.val() === '' || email.val() === '' || birthDate.val() === '' || questionA.val() === '' || answer1.val() === '' || questionB.val() === '' || answer2.val() === ''){
            //fill.css('color', 'red');
            myError.html('please fill all the fields');
        }
        else if(questionA.text() === questionB.text()){
            errorMessage.css('color', 'red');
            errorMessage.html('Secure questions could not be the same!');
        }
        else if (passwordInput.val() !== confirmPasswordInput.val()) {
            
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
                    window.location.href = '/register/error/' + err.responseText;
                }
            }
            
            $.ajax(requestConfig).then(function (responseMessage) {
                myError.html('');
                window.location.href = '/login';
            });

        }
    });
})(window.jQuery);
