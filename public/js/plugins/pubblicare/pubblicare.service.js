'use strict';

/**
 *    Pubblicare Service to handle requests.
 */

module.exports =
angular.module('plugins.pubblicare.service', []).factory('pubblicareService', function($http, diNotify) {
  var defaults, service;
  defaults = {
    files: []
  };
  service = {
    saveFile: function(title, body) {
      var di;
      di = diNotify({
        message: "Saving File to Pubblicare...",
        duration: 5000
      });
      return $http.post('save/pubblicare', {
        title: title,
        content: body
      }).then(function successCallback(data) {
        if (di != null) {
          di.$scope.$close();
        }
        if (window.ga) {
          ga('send', 'event', 'click', 'Save To Pubblicare', 'Save To...')
        }
        return diNotify({
          message: "Successfully saved to Pubblicare",
          duration: 5000
        });
      }, function errorCallback(err) {
        return diNotify({
          message: "An Error occured: " + err,
          duration: 5000
        });
      });
    },
    save: function() {
      localStorage.setItem('pubblicare', angular.toJson(service.fetched));
    },
    restore: function() {
      service.fetched = angular.fromJson(localStorage.getItem('pubblicare')) || defaults;
      return service.fetched;
    }
  };
  service.restore();
  return service;
});
