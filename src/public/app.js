const usernameField = document.getElementById('username');
const passwordField = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');

async function postData(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include', // Don't forget to specify this if you need cookies
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });

  return response.json(); // parses JSON response into native JavaScript objects
}

async function getData(url) {
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include', // Don't forget to specify this if you need cookies
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

loginBtn.addEventListener('click', async (event) => {
  event.preventDefault();
  const username = usernameField.value = 'rick';
  const password = passwordField.value = '12345678';
  const response = await postData('http://localhost:3001/api/login', { username, password });
  console.log(JSON.stringify(response));
});
