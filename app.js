//jshint version:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

// mailchimp api key
var apiKey = "c3c65d4eb5b23960a0341f99c97df81f-us1" ;

//mailchimp listID
var listID = "a60d5d7a2b";

// app.use() used for set up a middleware for our app
// specifies a static folder
app.use(express.static("public"));

// to show we are going to use encoded urls.
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/",function(req,res){
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var mail = req.body.email ;

  // new json object to post via API
  var data = {
    members:[
      {
        email_address: mail,
        status : "subscribed",
        merge_fields : {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  // to turn js data into json data
  var jsonData = JSON.stringify(data);

  const url = "https://us1.api.mailchimp.com/3.0/lists/" + listID ;

  const options = {
    method: "POST",
    auth: "iklim:c3c65d4eb5b23960a0341f99c97df81f-us1"
  }

  const request = https.request(url,options,function(response){
    response.on("data",function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

})


app.listen(3000,function(){
  console.log("server is up and running on port 3000");
})
