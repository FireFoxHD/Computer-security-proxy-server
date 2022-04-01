const logoutBtn = document.getElementById("logout-btn")
const searchBtn = document.getElementById("search-btn")
const searchField = document.getElementById("patientName")

const patientName = document.getElementById("patients-name")
const patientEmail = document.getElementById("patients-email")
const patientPhone = document.getElementById("patients-phone")
const patientDob = document.getElementById("patients-dob")

console.log(logoutBtn)


logoutBtn.addEventListener("click", async (event)=>{
    event.preventDefault()
    console.log("Logging out")
    window.location.href = "http://localhost:3000/index.html";
});

  
searchBtn.addEventListener("click", async (event)=>{
  event.preventDefault()
  let name = searchField.value
  if(!name || name.length == 1) return;
  
  let response = await getData(`http://localhost:3000/api/getUserbyName/${name}`)
  console.log(response)

  patientName.textContent = `${response.name.first} ${response.name.last}`;
  patientEmail.textContent = `${response.email}`;
  patientPhone.textContent = `${response.phone}`;
  patientDob.textContent = `${new Date(response.dob.date).toUTCString()}`;

  return;
});

/*
Susan
Aiden
Crystal
Rachel
Juliette
Melike
Annabelle
Charles
Aurora
*/ 



