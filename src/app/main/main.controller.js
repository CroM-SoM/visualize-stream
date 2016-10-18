(function() {
    'use strict';

    angular
        .module('test')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($timeout, $log, dataService) {
        var vm = this;

        vm.awesomeThings = [];

        vm.userCheck = [];

        getData();

        function getData() {
            vm.awesomeThings = dataService.apiMethod('between/100/200')
                .then(function(response) {
                    vm.awesomeThings = dataService.createUser(response);
                    $log.log(vm.awesomeThings);
                })

        }
        
    }
})();
