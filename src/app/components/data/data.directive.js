(function() {
    'use strict';

    angular
        .module('test')
        .directive('blaPage', blaPage);

    /** @ngInject */
    function blaPage() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/data/datapart.html'
        };

        return directive;
    }

})();
