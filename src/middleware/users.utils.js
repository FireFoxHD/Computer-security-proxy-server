import fetch from 'node-fetch';

let cache;

export async function getUsers(req, res, next) {
  if (cache) {
    req.userList = cache;
    return next();
  }

  const response = await fetch('https://randomuser.me/api/?seed=526d5948b943f9b1&inc=name,dob,email,phone,gender&results=50', {
    method: 'GET',
    mode: 'cors',

    headers: {
      'Content-Type': 'application/json',
    },
  });

  const json = await response.json();
  cache = json.results;
  req.userList = cache;
  return next();
}

export async function getUserbyName(req, res, next) {
  const firstName = req.params.name;
  let response;

  if (!cache) {
    response = await fetch('https://randomuser.me/api/?seed=526d5948b943f9b1&inc=name,dob,email,phone,gender&results=50', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();
    console.log('caching');
    cache = json.results;
  }

  req.user = cache.find((user) => user.name.first === firstName);
  next();
}

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
