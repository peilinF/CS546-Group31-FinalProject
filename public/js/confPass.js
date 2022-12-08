function check() {
  const myForm = document.getElementById('myForm');
  if(myForm){
    // const userName = xss(document.getElementById('usernameInput').value);
    // const email = xss(document.getElementById('emailInput').value);
    // const birthDate = xss(document.getElementById('birthDateInput').value);
    if (document.getElementById('passwordInput').value ===
    document.getElementById('confirmPasswordInput').value) {
    document.getElementById('message').style.color = 'green';
    document.getElementById('message').innerHTML = 'matching';
    } else {
    document.getElementById('message').style.color = 'red';
    document.getElementById('message').innerHTML = 'not matching';
    }
  }
}



