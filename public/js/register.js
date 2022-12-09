(function ($) {
    var myForm = $('#myForm'),
        passwordInput = $('#passwordInput'),
        confirmPasswordInput = $('#confirmPasswordInput');
    myForm.submit(function (e) {
        e.preventDefault();
        if (passwordInput.val() !== confirmPasswordInput.val()) {
            
            alert('Passwords do not match');
        } else {
            var requestConfig = {
                method: 'POST',
                url: '/register',
                contentType: 'application/json',
                data: JSON.stringify({
                    username: $('#usernameInput').val(),
                    email: $('#emailInput').val(),
                    birthDate: $('#birthDateInput').val(),
                    password: $('#passwordInput').val()
                })
            }
            $.ajax(requestConfig).then(function (responseMessage) {
                alert(responseMessage);
            });

        }
    });
})(window.jQuery);