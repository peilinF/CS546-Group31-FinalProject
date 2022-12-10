(function ($) {
  var myForm = $('#passForm'),
      passwordInput = $('#passwordInput'),
      confirmPasswordInput = $('#confirmPasswordInput');
      questionA = $('#questionsA option:selected');
      questionB = $('#questionsB option:selected');
      errorMessage = $('#errorMessage');
      mySpan = $('#message');
  myForm.submit(function (e) {
      e.preventDefault();
      if(questionA.text() === questionB.text()){
        errorMessage.css('color', 'red');
        errorMessage.html('Secure questions should not be same!')
      }
      
      if (passwordInput.val() !== confirmPasswordInput.val()) {
          
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
                  email: $('#emailInput').val(),
                  password: $('#passwordInput').val(),
                  questionA:$('#questionsA option:selected').text(),
                  answer1: $('#answerInput1').val(),
                  questionB: $('#questionsB option:selected').text(),
                  answer2:$('#answerInput2').val()
              })
          }
          $.ajax(requestConfig).then(function (responseMessage) {
              
              window.location.href = '/login';
          });

      }
  });
})(window.jQuery);



