(function() {
  'use strict';

  angular
    .module('test')
    .directive('mapPage', mapPage);

  /** @ngInject */
  function mapPage() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/map/map.html'
    };

    return directive;
  }

})();