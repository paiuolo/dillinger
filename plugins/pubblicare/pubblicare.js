"use strict"

const fs = require('fs')
  , path = require('path')
  , request = require('request')
  , url = require('url')
  , pubblicareSdk = require('./pubblicareClient')
  ;

var pubblicare_config_file = path.resolve(__dirname, '../../configs/pubblicare/', 'pubblicare-config.json')
  , pubblicare_config = {}
  , isConfigEnabled = false
  ;


// ^^^helps with the home page view should we show the pubblicare dropdown?
if ( fs.existsSync(pubblicare_config_file) ) {
  pubblicare_config = require(pubblicare_config_file)
  isConfigEnabled = true
  console.log('Pubblicare config found in environment. Plugin enabled.')
} else if (process.env.pubblicare_client_id !== undefined) {
  pubblicare_config = {
    "client_id": process.env.pubblicare_client_id,
    "client_secret": process.env.pubblicare_client_secret,
    "callback_url": process.env.pubblicare_callback_url,
    "redirect_url": process.env.pubblicare_redirect_url
  }
  isConfigEnabled = true
  console.log('Pubblicare config found in environment. Plugin enabled.')
} else {
  pubblicare_config = {
    "client_id": "YOUR_CLIENT_ID"
  , "client_secret": "YOUR_SECRET"
  , "callback_url": "YOUR_CALLBACK_URL"
  , "redirect_url": "YOUR_REDIRECT_URL"
  }
  console.warn('Pubblicare config not found at ' + pubblicare_config_file + '. Plugin disabled.')
}

exports.Pubblicare = (function() {

  var pubblicareApp = new pubblicareSdk.PubblicareClient({
    clientId: pubblicare_config.client_id,
    clientSecret: pubblicare_config.client_secret
  })
  
  return {
    pubblicareClient: pubblicareApp,
    isConfigured: isConfigEnabled,
    config: pubblicare_config,
    generateAuthUrl: function(req, res, cb) {

      return pubblicareApp.getAuthorizationUrl('dillinger-secrets-are-insecure', pubblicare_config.redirect_url, [
        pubblicareSdk.Scope.BASIC_PROFILE, pubblicareSdk.Scope.PUBLISH_POST
      ])

    },
    getUser: function(req, res, cb) {

      pubblicareApp.getUser(function getPubblicareUserCb(err,user){
        if(err) return cb(err)
        else return cb(null,user)
      })

    }, // end getUsername
    setAccessTokenFromSession: function(token){
      pubblicareApp.setAccessToken(token)
    },
    save: function(req, res){

      var title = req.body.title || 'New Unnamed Post'

      pubblicareApp.createPost({
        userId: req.session.pubblicare.userId,
        title: title,
        contentFormat: pubblicareSdk.PostContentFormat.MARKDOWN,
        content: req.body.content,
        publishStatus: pubblicareSdk.PostPublishStatus.DRAFT
      }, function (err, post) {

        if(err){
          console.error(err.message)
          return res.status(400).json(err.message + " Please unlink and relink your Pubblicare account.")
        }

        return res.status(200).json(post)

      }) // end createPost

    } // end SaveToPubblicare
  } // end return object
})()
