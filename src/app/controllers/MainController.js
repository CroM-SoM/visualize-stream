(function () {

    angular
        .module('app')
        .controller('MainController', [
            'navService','$mdSidenav', '$mdBottomSheet', '$log', '$q', '$state', '$mdToast','$mdEditDialog','$scope', '$rootScope', '$timeout', '$location','$mdEditDialog', '$mdDialog', '$http', 'appConf',
            MainController
        ]);
    function MainController(navService,$mdSidenav, $mdBottomSheet, $log, $q, $state, $mdToast, $mdEditDialog, $scope, $rootScope, $timeout, $location, $mdEditDialog, $mdDialog, $http, appConf) {

        var vm = this;
        vm.menuItems = [];
        vm.title;

        navService
            .loadAllItems()
            .then(function (menuItems) {
                vm.menuItems = [].concat(menuItems);
            });
    }

})();
