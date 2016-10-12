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
        // userData();

        function getData() {
            vm.awesomeThings = dataService.apiMethod()
                .then(function(response) {
                    vm.awesomeThings = response;
                    $log.log(vm.awesomeThings);
                })
        }
        // function userData() {
        //     vm.userCheck = dataService.api()
        //         .then(function(response) {
        //             vm.userCheck = response;
        //             $log.log(vm.userCheck);
        //         })
        // }

    }
})();
