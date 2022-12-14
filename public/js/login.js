(function ($) {
  var myForm = $('#login-form'),
      passwordInput = $('#PasswordInput'),
      myError = $('#error2'),
      mySpan = $('#loginErr'),
      email = $('#EmailInput')
  myForm.submit(function (e) {
      e.preventDefault();
      if ( passwordInput.val() === '' || email.val() === ''){
        mySpan.css('color', 'red');
        mySpan.html('Please fill all the fields!');
        return;
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