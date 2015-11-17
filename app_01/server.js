var express = require('Express');
var app = express();
var path = require('path');

app.get('/',function(req,res)
       {
        res.sendFile(path.join(__dirname+'/index.html')); 
});
app.listen(1337);
console.log("1337 is a magic port :D");

var adminRoute = express.Router();
// route middleware which gets called before every request
adminRoute.use(function(req,res,next){
              console.log(req.method,req.url);
               //continue doing what we were doing and go to the routes
               next();
              });

adminRoute.get('/',function(req,res){
    res.send("I am dashboard");
});
adminRoute.get('/users',function(req,res){
    res.send("I show all the users");
});

//validating the parameters passed through the url 
adminRoute.param("name",function(req,res,next,name){
    // doing validation on name here
    console.log("doing validation for name parameter");
    next();
});
// after route middleware, writing the url get function
adminRoute.get('/users/:name',function(req,res){
    res.send("Hello "+req.params.name+"! Welcome to Awesomeness !");
});
adminRoute.get('/posts',function(req,res){
    res.send("I show all the posts");
});
app.use("/admin",adminRoute);

adminRoute.route("/login")

    .get(function(req,res){
      res.send("This is the login form");
    })
    .post(function(req,res){
      res.send("Processing the login form");
      console.log("Processing");
    });

/*// get the http and filesystem modules
 var http = require('http'),
    fs = require('fs');
  
  // create our server using the http module
  http.createServer(function(req, res) {
  
    // write to our server. set configuration for the response
    res.writeHead(200, {
     'Content-Type': 'text/html',
     'Access-Control-Allow-Origin' : '*'
   });
 
   // grab the index.html file using fs
   var readStream = fs.createReadStream(__dirname + '/index.html');
 
   // send the index.html file to our user
   readStream.pipe(res);  
 
 }).listen(1337);
 
 // tell ourselves what's happening
 console.log('Visit me at http://localhost:1337');*/