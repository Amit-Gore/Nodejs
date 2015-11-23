// BASE SETUP
 // ======================================

 // CALL THE PACKAGES --------------------
 var express = require('express'); // call express
 var app = express(); // define our app using express
 var bodyParser = require('body-parser'); // get body-parser
 var morgan = require('morgan'); // used to see requests
 var mongoose = require('mongoose'); // for working w/ our database
 var port = process.env.PORT || 8080; // set the port for our app
 var jwt = require('jsonwebtoken');
 //using our user.js file as a model
 var User = require("./app/models/user");
 var SuperSecret = 'codehard';
 // connect to our database (hosted on modulus.io)
 //mongoose.connect('mongodb://node:noder@novus.modulusmongo.net:27017/Iganiq8o');
 mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');

 // APP CONFIGURATION ---------------------
 // use body parser so we can grab information from POST requests
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(bodyParser.json());

 // configure our app to handle CORS requests
 app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
 res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
 Authorization');
 next();
 });

 // log all requests to the console
 app.use(morgan('dev'));

 // ROUTES FOR OUR API
 // =============================

 // basic route for the home page
 app.get('/', function(req, res) {
 res.send('Welcome to the home page!');
 });

 // get an instance of the express router
 var apiRouter = express.Router();
 // route to authenticate a user (POST http://localhost:8080/api/authenticate)
 apiRouter.post('/authenticate',function(req,res){
     // find the user
     // select the name username and password explicitly
     User.findOne({
         username: req.body.username
     }).select('name username password').exec(function(err,user){
         if(err) throw err;
         //if no user with that username was found 
         
         if(!user){
             res.json({success:false,message:'Authentication Failed'
         });
         }
         else if(user) {
             //check if password matches
             var validPassword = user.comparePassword(req.body.password);
             if (!validPassword){
                 res.json({
                     success:false,
                     message: 'Authentication Failed, password not matched'
                 });   
             }
             else{
                 //if authentication is succeded
                 //create a token
                 var token = jwt.sign(
                     {name : user.name,
                     username : user.username},
                      SuperSecret,
                     {
                       expiresInMinutes: 1440     
                      }                
                );
                 res.json({
                     success:true,
                     message:'Token Create Amit',
                     token : token    
                 });
             }
         }
         
     });
     
 });

 apiRouter.use(function(req,res,next){
     var token = req.body.token||req.param('token')||req.headers['x-access-token'];
     if(token){
         //verify secret and expiration
         jwt.verify(token,SuperSecret,function(err,decoded){
             if(err)
                 {
                     return res.status(403).send({
                         success:false,
                         message:'failed to authenticate the token.'
                     });
                     
                 }
             else{
                 //if everything is good then save the requst for use in other routes
                 req.decoded= decoded;
                 next();
             }
         });
         
     }
     else{
         //token not received
         //return a http response of 403(forbidden access)and error message
         return res.status(403).send({
             success:false,
             message: 'Token not received'
         });
         
     }
 });

apiRouter.get('/me',function(req,res){
    res.send(req.decoded);
});

apiRouter.route('/users')
// create a user (accessed at POST http://localhost:8080/api/users)
 
.post(function(req, res) {

     // create a new instance of the User model
     var user = new User();

     // set the users information (comes from the request)
     user.name = req.body.name;
     user.username = req.body.username;
     user.password = req.body.password;

     // save the user and check for errors
     user.save(function(err) {
     if (err) {
     // duplicate entry
     if (err.code == 11000)
     return res.json({ success: false, message: 'A user with that\
     username already exists. '});
     else
     return res.send(err);
     }

     res.json({ message: 'User created!' });
     });

     })
.get(function(req,res){
        User.find(function(err,users){
            if(err)res.send(err);
            res.json(users);
        });
    });

// on routes that end in /users/:user_id
 // ----------------------------------------------------
 apiRouter.route('/users/:user_id')

 // get the user with that id
 // (accessed at GET http://localhost:8080/api/users/:user_id)
.get(function(req, res) {
     User.findById(req.params.user_id, function(err, user) {
     if (err) res.send(err);

     // return that user
     res.json(user);
     });
 })
.put(function(req,res){
       //use our user model to find the user we want
     User.findById(req.params.user_id,function(err,user){
         if(err) res.send(err);
         //update the user only if its new
         if(req.body.name) user.name = req.body.name;
         if(req.body.username) user.username = req.body.username;
         if(req.body.password) user.password = req.body.password;
         
         //save the user
         user.save(function(err){
             if(err) res.send(err);
             res.json({message: "user updated !"});
         });
     });
 })
.delete(function(req, res) {
     User.remove({
     _id: req.params.user_id
     }, function(err, user) {
     if (err) return res.send(err);

     res.json({ user:user.name,message: 'Successfully deleted' });
     });
 });

     // test route to make sure everything is working
     // accessed at GET http://localhost:8080/api
     apiRouter.get('/', function(req, res) {
     res.json({ message: 'hooray! welcome to our api!' });
     });

 // more routes for our API will happen here

 // REGISTER OUR ROUTES -------------------------------
 // all of our routes will be prefixed with /api
 app.use('/api', apiRouter);

 // START THE SERVER
 // ===============================
 app.listen(port);
 console.log('Magic happens on port ' + port);