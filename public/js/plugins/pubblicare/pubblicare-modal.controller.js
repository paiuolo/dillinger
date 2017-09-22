
'use strict';

module.exports =
  angular
  .module('plugins.pubblicare.modal', [
    'plugins.pubblicare.service'
  ])
  .controller('PubblicareModal', function($modalInstance, pubblicareService) {

  var vm = this;


  //////////////////////////////

  function setFile() {
    return $modalInstance.close();
  }

  function closeModal() {
    return $modalInstance.dismiss('cancel');
  }

  vm.onPageChange = function() {
    vm.fetchRepos(null, vm.currentPage);
  }

});
