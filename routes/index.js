'use strict'

var path = require('path')
  , request = require('request')
  , qs = require('querystring')
  , Dropbox = require( path.resolve(__dirname, '../plugins/dropbox/dropbox.js') ).Dropbox
  , Bitbucket = require( path.resolve(__dirname, '../plugins/bitbucket/bitbucket.js') ).Bitbucket
  , Github = require( path.resolve(__dirname, '../plugins/github/github.js') ).Github
  , Medium = require( path.resolve(__dirname, '../plugins/medium/medium.js') ).Medium
  , GoogleDrive = require('../plugins/googledrive/googledrive.js').GoogleDrive
  , OneDrive = require('../plugins/onedrive/onedrive.js').OneDrive
  , Sponsored = require('../plugins/sponsored/sponsored.js')
  , GoogleAnalytics = require('../plugins/googleanalytics/googleanalytics.js')
  
  , Pubblicare = require( path.resolve(__dirname, '../plugins/pubblicare/pubblicare.js') ).Pubblicare
  ;

// Show the home page
exports.index = function(req, res) {

  // Some flags to be set for client-side logic.
  var indexConfig = {
    isDropboxAuth: !!req.session.isDropboxSynced,
    isBitbucketAuth: !!req.session.isBitbucketSynced,
    isGithubAuth: !!req.session.isGithubSynced,
    isMediumAuth: !!req.session.isMediumSynced,
    isEvernoteAuth: !!req.session.isEvernoteSynced,
    isGoogleDriveAuth: !!req.session.isGoogleDriveSynced,
    isOneDriveAuth: !!req.session.isOneDriveSynced,
    isDropboxConfigured: Dropbox.isConfigured,
    isBitbucketConfigured: Bitbucket.isConfigured,
    isGithubConfigured: Github.isConfigured,
    isMediumConfigured: Medium.isConfigured,
    isGoogleDriveConfigured: GoogleDrive.isConfigured,
    isOneDriveConfigured: OneDrive.isConfigured,
    isSponsoredConfigured: Sponsored.isConfigEnabled,
    isGoogleAnalyticsConfigured: GoogleAnalytics.isConfigEnabled,
    
    isPubblicareConfigured: Pubblicare.isConfigured,
    isPubblicareAuth: Pubblicare.isPubblicareSynced,
  }

  // Capture Bitbucket username for the future...
  if (req.session.bitbucket && req.session.bitbucket.username) indexConfig.bitbucket_username = req.session.bitbucket.username
  else indexConfig.isBitbucketAuth = false

  // Capture github username for the future...
  if (req.session.github && req.session.github.username) indexConfig.github_username = req.session.github.username

  // If GA is enabled, let's create the HTML and tracking
  if (GoogleAnalytics.isConfigEnabled){
    indexConfig.GATrackSponsoredLinksHTML = GoogleAnalytics.generateTrackSponsoredLinkClicks()
    indexConfig.GATrackingHTML = GoogleAnalytics.generateGATrackingJS()
  }

  // Check for Medium bits...
  if (req.session.medium && req.session.medium.oauth 
      && req.session.medium.oauth.token && req.session.medium.oauth.token.access_token) {
    // Set the access token on the medium client
    Medium.setAccessTokenFromSession(req.session.medium.oauth.token.access_token)
  }else{
    req.session.isMediumSynced = false
  }
  

  // Check for Pubblicare bits...
  if (req.session.pubblicare && req.session.pubblicare.oauth 
      && req.session.pubblicare.oauth.token && req.session.pubblicare.oauth.token.access_token) {
    // Set the access token on the pubblicare client
    Pubblicare.setAccessTokenFromSession(req.session.pubblicare.oauth.token.access_token)
  }else{
    req.session.isPubblicareSynced = false
  }

  // If Sponsored ads is enabled get the ad HTML
  // if(Sponsored.isConfigEnabled){
  //   let forwardedIp = req.headers['X-Forwarded-For'] || req.connection.remoteAddress

  //   console.log('X-Forwarded-For: \t' + req.headers['X-Forwarded-For'])

  //   console.log(req.ip)
  //   console.dir(req.ips)

  //   // WARNING: this will break when we switch to IPv6
  //   if (forwardedIp.substr(0, 7) == "::ffff:") {
  //     forwardedIp = forwardedIp.substr(7)
  //   }

  //   Sponsored.fetchAd(forwardedIp, function createAdCb(json){
  //     indexConfig.adHTML = Sponsored.generateAdHTML(json)
  //     return res.render('index', indexConfig)
  //   })
  // }
  // else{
    return res.render('index', indexConfig)    
  // }

}

// Show the not implemented yet page
exports.not_implemented = function(req, res) {
  res.render('not-implemented')
}
