(function() {
  'use strict';

  angular
    .module('src')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, $log, dataService) {
    var vm = this;

    vm.awesomeThings = [];
    vm.classAnimation = '';
    vm.creationDate = 1473683661938;

    activate();

    function activate() {
     
      $timeout(function() {
        vm.classAnimation = 'rubberBand';
      }, 4000);
    }

    getData();

    function getData() {
      vm.awesomeThings = dataService.apiMethod();
      $log.log(vm.awesomeThings);
    }
  }
})();
