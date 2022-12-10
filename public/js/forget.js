(function ($) {
  var myForm = $('#passForm'),
      passwordInput = $('#passwordInput'),
      confirmPasswordInput = $('#confirmPasswordInput');
      mySpan = $('#message');
  myForm.submit(function (e) {
      e.preventDefault();
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



