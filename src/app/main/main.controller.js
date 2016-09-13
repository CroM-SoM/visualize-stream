(function () {
  'use strict';

  angular
    .module('test')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout,$log, dataService) {
    var vm = this;

    vm.awesomeThings = [];
    vm.classAnimation = '';
    vm.creationDate = 1473694201167;

    activate();

    function activate() {
      //getWebDevTec();
      getData();
      $timeout(function () {
        vm.classAnimation = 'rubberBand';
      }, 4000);
    }

    function getData() {
      vm.awesomeThings = dataService.apiMethod();
      $log.log(vm.awesomeThings);
    }

    /*
    function getWebDevTec() {
      /!*vm.awesomeThings = webDevTec.getTec();
       angular.forEach(vm.awesomeThings, function(awesomeThing) {
       awesomeThing.rank = Math.random();
       });*!/
    }*/
  }
})();
