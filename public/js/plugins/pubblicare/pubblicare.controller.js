'use strict';

module.exports = angular
                  .module('plugins.pubblicare', ['plugins.pubblicare.service'])
                  .controller('Pubblicare', function($rootScope, pubblicareService, documentsService){
                      var saveTo
                        , vm
                        ;
                      vm = this;
                      saveTo = function() {
                        var body
                          , title
                          ;
                        
                        title = documentsService.getCurrentDocumentTitle()
                        body = documentsService.getCurrentDocumentBody()
                        return pubblicareService.saveFile(title, body)
                      }
                      vm.saveTo = saveTo
                    }) // end controller
