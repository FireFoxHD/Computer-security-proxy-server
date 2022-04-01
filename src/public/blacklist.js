const ipField = document.getElementById("ip-list")

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

async function getBlacklist(){
  let response = await getData('http://localhost:3000/admin//blacklist')
  console.log(response)

  response.forEach(element => {
    let ipElement = document.createElement("p");
    ipElement.textContent = element;
    ipField.appendChild(ipElement);
  });
  

}

getBlacklist();