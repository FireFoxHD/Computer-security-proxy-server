# Node Proxy server

### This server allows secure access to user information by intercepting requests, after which it routes the request. 

This server acts a proxy for another server which serves user data (in this demonstration it calls the randomuser API to get user information to simulate an server with user database).
 
This proxy has alot of features indended to protect this user information, these features include: 
 - Request logging 
 - IP blacklisting 
 - Rate Limiting (prevents spamming server endpoints)
 - Authentication 


## Setup

```
npm install
```

## Lint

```
npm run lint
```

<!-- ## Test

```
npm run test
``` -->

## Development

```
npm run dev
```
