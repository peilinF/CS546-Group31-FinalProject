$('#passwordInput, #confirmPasswordInput').on('keyup', function () {
  if ($('#passwordInput').val() == $('#confirmPasswordInput').val()) {
    $('#message').html('Matching').css('color', 'green');
  } else 
    $('#message').html('Not Matching').css('color', 'red');
});