//Require other files:
const renderer = require ("./renderer.js"); 
const Profile = require("./profile.js");

//Node.js:
const fs = require("fs");
const querystring = require('querystring'); 

//Load CSS dynamically (the stylesheet found in header) 
const css = function (request, response) {
    if (request.url.indexOf('css') !== -1) {
        const css = fs.createReadStream(__dirname + request.url, 'utf8');
        css.pipe(response);
    }
};

//When requesting home
function homeRoute(request, response) {
  if(request.url === "/"){
    if(request.method.toUpperCase() === 'GET'){
      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/html');
      renderer.view("header", {}, response);
      renderer.view("search", {}, response);
      renderer.view("footer", {}, response);
      response.end();
    } 
    //IF POST:
    else {  
      request.on("data", (postBody) => { 
        let query = querystring.parse(postBody.toString());
        response.statusCode = 303;
        response.writeHead(303, {"Location" : `/${query.username}`}); 
        response.end(); 
      });
    }
  }
}  

//So that able to search for user by going url/davidlacho
function userRoute(request, response) {
    let username = request.url.replace("/", "");
    const miscUrls = request.url.indexOf('css') !== -1;
    if (username.length > 0 && !(miscUrls)) {
      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/html');
      renderer.view("header", {}, response);
      //Get the JSON data:
      let studentProfile = new Profile(username);
      studentProfile.on("end", (profileJSON) => {
        let values = {
          avatarUrl: profileJSON.gravatar_url,
          username : profileJSON.profile_name,
          badges: profileJSON.badges.length,
          javaScriptPoints : profileJSON.points.JavaScript
        }
        renderer.view("profile", values, response);
        renderer.view("footer", {}, response);
        response.end();
      });
  
      studentProfile.on("error", (e) => {
        renderer.view("error", {errorMessage: e.message}, response);
        renderer.view("search", {}, response);
        renderer.view("footer", {}, response);
        response.end();
      });
    }
}

module.exports.homeRoute = homeRoute; 
module.exports.userRoute = userRoute; 
module.exports.css = css;