(function() {
  'use strict';

  angular
    .module('test')
    .directive('aboutPage', aboutPage);

  /** @ngInject */
  function aboutPage() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/about/about.html'
    };

    return directive;
  }

})();