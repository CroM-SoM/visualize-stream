(function() {
    'use strict';

    angular
        .module('test')
        .controller('MainController', MainController);

    /** @ngInject */
    //$timeout, $log, dataService
    function MainController() {
        var vm = this;

        vm.awesomeThings = [];
        //getData();

        /*function getData() {
            vm.awesomeThings = dataService.apiMethod('between/100/200')
                .then(function(response) {
                    vm.awesomeThings = dataService.createUser(response);
                    $log.log(vm.awesomeThings);
                })
        }*/
    }
})();
