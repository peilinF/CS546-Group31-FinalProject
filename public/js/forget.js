(function ($) {
  var myForm = $('#passForm'),
      passwordInput = $('#passwordInput1'),
      email = $('#emailInput1');
      confirmPasswordInput = $('#confirmPasswordInput1');
      questionA = $('#questionsA1');
      questionB = $('#questionsB1');
      answer1 = $('#answerInputA');
      answer2 = $('#answerInputB');
      errorMessage = $('#errorMessage1');
      mySpan = $('#message1');
      myError = $('#error1'),
  myForm.submit(function (e) {
      e.preventDefault();
      if ( passwordInput.val() === '' || confirmPasswordInput.val() === '' || email.val() === '' || questionA.val() === '' || answer1.val() === '' || questionB.val() === '' || answer2.val() === ''){
          errorMessage.css('color', 'red');
          errorMessage.html('Please fill all the fields!');
          return;
      }

      if(questionA.val() === questionB.val()){
        errorMessage.css('color', 'red');
        errorMessage.html('Secure questions should not be same!');
        return;
      }

      if (passwordInput.val() !== confirmPasswordInput.val()) {
          errorMessage.html('');
          mySpan.css('color', 'red');
          mySpan.html('not matching');
      } else {
          mySpan.css('color', 'green');
          mySpan.html('matching');
          var requestConfig = {
              method: 'POST',
              url: '/forget',
              contentType: 'application/json',
              data: JSON.stringify({
                  email: $('#emailInput1').val(),
                  password: $('#passwordInput1').val(),
                  questionA:$('#questionsA1 option:selected').text(),
                  answer1: $('#answerInputA').val(),
                  questionB: $('#questionsB1 option:selected').text(),
                  answer2:$('#answerInputB').val()
              }),
              error: function (err) {
                errorMessage.css('color', 'red');
                errorMessage.html(err.responseText);
            }
          }
          $.ajax(requestConfig).then(function (responseMessage) {
              console.log('success');
              window.location.href = '/login';
          });

      }
  });
})(window.jQuery);



