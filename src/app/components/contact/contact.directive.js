(function() {
  'use strict';

  angular
    .module('test')
    .directive('contactPage', contactPage);

  /** @ngInject */
  function contactPage() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/contact/contact.html'
    };

    return directive;
  }

})();
