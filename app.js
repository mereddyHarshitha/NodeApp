var nforce = require('nforce');
var express = require('express');
var port = process.env.PORT || 3000;

var org = nforce.createConnection({
  clientId: '3MVG9n_HvETGhr3AerhMPQWA3Z_X_pZduM18nC6jICZEY3ZAJynYZSnga4b3rMWiNgtj6II4of3kcEe.vgLL9',
  clientSecret: '28DD8FEB6824FBFFA664936E73A0359EACE498F595BC7DCCF0D7B352677F6974',
  redirectUri: 'https://lwcopplist.herokuapp.com/oauth/_callback',
  apiVersion: 'v47.0',  // optional, defaults to current salesforce API version
  environment: 'production',  // optional, salesforce 'sandbox' or 'production', production default
  mode: 'multi' // optional, 'single' or 'multi' user mode, multi default
});

var app = express();

// Require Routes js
var routesHome = require('./routes/home');

// Serve static files
app.use(express.static(__dirname + '/public'));

app.use('/home', routesHome);

app.set('view engine', 'ejs');

app.get('/', function(req,res){
  res.redirect(org.getAuthUri());
});

app.get('/oauth/_callback', function(req, res) {
  org.authenticate({code: req.query.code}, function(err, resp){
    if(!err) {
      console.log('Access Token: ' + resp.access_token);
      app.locals.oauthtoken = resp.access_token;
      app.locals.lightningEndPointURI = "https://hmereddydemocomporg-dev-ed.my.salesforce.com";
      res.redirect('/home');
    } else {
      console.log('Error: ' + err.message);
    }
  });
});

// Served Localhost
console.log('Served: http://localhost:' + port);
app.listen(port);
