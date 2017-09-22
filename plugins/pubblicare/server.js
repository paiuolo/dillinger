var express = require('express')
  , app = module.exports = express()
  , Pubblicare = require('./pubblicare.js').Pubblicare
  , fs = require('fs')
  , path = require('path')

/* Pubblicare Stuff */

// "http://dillinger.io/oauth/pubblicare"
var oauth_pubblicare_redirect = function(req, res) {
  
  // Create Pubblicare session object and stash for later.
  req.session.pubblicare = {
    oauth: {
      token: null
    }
  }

  return res.redirect( Pubblicare.generateAuthUrl(req) )
}


var oauth_pubblicare = function(req, res, cb) {

  if (!req.query.code) { cb() } 
  else {
    req.session.oauth = {}

    var code = req.query.code
      , client_id = Pubblicare.config.client_id
      , redirect_url = Pubblicare.config.redirect_url
      , client_secret = Pubblicare.config.client_secret
      ;

    Pubblicare.pubblicareClient.exchangeAuthorizationCode(code, redirect_url, function (err, token) {

      // Fix this...this is bad for the user...
      if(err) return console.error(err.message)

      // If it doesn't exist, create it.
      if (!req.session.pubblicare) {
        req.session.pubblicare = {
          oauth: null
        }
      }
      // Attach the token object to the session
      req.session.pubblicare.oauth.token = token

      // Initiate a getUser call to stash the user ID      
      Pubblicare.pubblicareClient.getUser(function (err, user) {
        if(err) {
          // something went wrong
          console.error(err.message)
          unlink_pubblicare(req, res)
          return res.send(err.message)
        }
        else{
          req.session.pubblicare.userId  = user.id
          req.session.isPubblicareSynced = true
          res.redirect('/')            
        }
      }) // end getUser
    }) // end exchangeAuthorizationCode
  } // end else
} // end oauth_pubblicare()

var unlink_pubblicare = function(req, res) {
  // Essentially remove the session for pubblicare...
  delete req.session.pubblicare
  req.session.isPubblicareSynced = false
  res.redirect('/')
}

var save_pubblicare = function(req, res) { 

  if (!req.session.pubblicare) {
    res.status(401).send('Pubblicare is not linked.');
    return;
  }

  if(req.session.isPubblicareSynced) Pubblicare.save(req,res)
  else res.redirect('/redirect/pubblicare/')

}

/* End Pubblicare stuff */

/* Begin Pubblicare */

app.get('/redirect/pubblicare', oauth_pubblicare_redirect)

app.get('/oauth/pubblicare', oauth_pubblicare)

app.get('/unlink/pubblicare', unlink_pubblicare)

// app.get('/account/pubblicare', account_info_pubblicare)

app.post('/save/pubblicare', save_pubblicare)

app.get('/js/pubblicare.js', function(req, res) {
  fs.readFile(path.join(__dirname, 'client.js'), 'utf8', function(err, data) {
    if (err) {
      res.send(500, "Sorry couldn't read file")
    }
    else {
      res.setHeader('content-type', 'text/javascript')
      res.send(200, data)
    }
  })
})
/* End Pubblicare */
