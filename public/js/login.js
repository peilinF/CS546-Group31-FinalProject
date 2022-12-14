(function ($) {
  var myForm = $('#login-form'),
      passwordInput = $('#PasswordInput'),
      myError = $('#error2'),
      email = $('#EmailInput')
  myForm.submit(function (e) {
      e.preventDefault();
      if ( passwordInput.val() === '' || email.val() === ''){
          window.location.href = '/register/error/' + 'please fill all the fields';
      }
      else {
          var requestConfig = {
              method: 'POST',
              url: '/login',
              contentType: 'application/json',
              data: JSON.stringify({
                  email: $('#emailInput').val(),
                  password: $('#passwordInput').val()
              }),
              error: function (err) {
                  window.location.href = '/login/error/' + err.responseText;
              }
          }
          
          $.ajax(requestConfig).then(function (responseMessage) {
              myError.html('');
              window.location.href = '/login';
          });
      }
  });
})(window.jQuery);