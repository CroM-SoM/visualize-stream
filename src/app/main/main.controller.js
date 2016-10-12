(function() {
    'use strict';

    angular
        .module('test')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($timeout, $log, dataService) {
        var vm = this;

        vm.awesomeThings = [];
        vm.cityCheck = [];
        vm.userCheck = [];

        getData();

        function getData() {
            vm.awesomeThings = dataService.apiMethod('between/1/50')
                .then(function(response) {
                    vm.awesomeThings = dataService.checkUserData(response);
                    $log.log(vm.awesomeThings);
                })


        }
        
    }
})();
