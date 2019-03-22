'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');

const cors = require('cors');
const urlExists = require('url-exists');
var app = express();
var longURL = 'https://github.com/tanepiper/node-bitly'
// Basic Configuration 
var port = process.env.PORT || 3000;
const { BitlyClient } = require('bitly');
const bitly = new BitlyClient('615a673451e1da10acaae69dc08bc13193e38e3b', {});
//console.log(bitly)

bitly
  .shorten(longURL)
  .then(function(result) {
    console.log(result);
  })
  .catch(function(error) {
    console.error(error);
  });


const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// app.route('/name').get((req, res) => {
//    var first = req.query.first;
//    var last = req.query.last;
//    var jsonObj = {name: first + ' ' + last};
//    res.send(jsonObj);
//  }).post();

// const BitlyClient = require('bitly');
// const bitly = new BitlyClient('615a673451e1da10acaae69dc08bc13193e38e3b');
 
// bitly
//   .shorten('https://github.com/tanepiper/node-bitly')
//   .then(function(result) {
//     console.log(result);
//   })
//   .catch(function(error) {
//     console.error(error);
//   });

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://suresh:suresh@fcmongodb-yulsn.mongodb.net/fccshorturl?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("fccshorturl").collection("urlsss");
  // perform actions on the collection object
  client.close();
});

//mongoose.connect('mongodb://localhost:27017/testapilocal',)
/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI,{ useNewUrlParser: true })

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// app.route('/name').get((req, res) => {
//    var first = req.query.first;
//    var last = req.query.last;
//    var jsonObj = {name: first + ' ' + last};
//    res.send(jsonObj);
//  }).post();

app.post('/api/shorturl/new:url(*)',(req,res)=>{
  var url = req.body.url
console.log('url link    ', url)
  urlExists(url, function(err, exists) {
  console.log(exists); // true
    if(exists === true){
    bitly
  .shorten(url)
  .then(function(result) {
      console.log(result)
    console.log('converted URL    ',result.url);
      console.log('long url ',result.long_url)
  res.send({"original_url":result.long_url,"short_url":result.url})     
  })
  .catch(function(error) {
    console.error(error);
  });
    }
    else{
      res.send({"error":"invalid URL"}) 
    }
      
});
})

 //{"original_url":"www.google.com","short_url":1} 
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});