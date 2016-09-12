(function () {
  'use strict';

  angular
    .module('src')
    .service('dataAPI', dataAPI);

  /** @ngInject */
  function dataAPI() {
    this.getAPI = getAPI

    function getAPI() {
      return {data: "here is my API"};
    }
  }

})();
