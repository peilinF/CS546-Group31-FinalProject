(function ($) {
  var myForm = $('#passForm'),
      passwordInput = $('#passwordInput1'),
      email = $('#emailInput1');
      confirmPasswordInput = $('#confirmPasswordInput1');
      questionA = $('#questionsA1 option:selected');
      questionB = $('#questionsB1 option:selected');
      answer1 = $('#answerInputA');
      answer2 = $('#answerInputB');
      errorMessage = $('#errorMessage1');
      mySpan = $('#message1');
      myError = $('#error1'),
  myForm.submit(function (e) {
      e.preventDefault();
      if ( passwordInput.val() === '' || confirmPasswordInput.val() === '' || email.val() === '' || questionA.val() === '' || answer1.val() === '' || questionB.val() === '' || answer2.val() === ''){
        window.location.href = '/forget/error/' + 'please fill all the fields';
      }

      if(questionA.val() === questionB.val()){
        errorMessage.css('color', 'red');
        errorMessage.html('Secure questions should not be same!')
      }

      if (passwordInput1.val() !== confirmPasswordInput1.val()) {
          
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
                window.location.href = '/forget/error/' + err.responseText;
            }
          }
          $.ajax(requestConfig).then(function (responseMessage) {
              myError.html('');
              window.location.href = '/login';
          });

      }
  });
})(window.jQuery);



