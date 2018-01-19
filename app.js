//Problem:
//We need a simple way to look at a user's badgecount and JS points from a web browser
//Solution:
//Use Node.js to perform the profile lookups and serve our templates via http

//1. Create a web server
const router = require('./router.js');  
const renderer = require('./renderer.js'); 

const http = require('http');
const port = 3000;
const server = http.createServer((request, response) => {
  router.css(request, response); 
  router.homeRoute(request, response); 
  router.userRoute(request, response); 
});

server.listen(port, () => {
  console.log(`Server running at http://${port}/`);
});

