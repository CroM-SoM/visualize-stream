(function() {
    'use strict';

    angular
        .module('test')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($timeout, $log, dataService) {
        var vm = this;

        vm.awesomeThings = [];
        getData();

        function getData() {
            vm.awesomeThings = dataService.apiMethod()
                .then(function(response) {
                    $log.log(response);
                })
        }

    }
})();
