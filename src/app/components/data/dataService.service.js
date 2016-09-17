(function () {
  'use strict';

  angular
    .module('test')
    .service('dataService', dtservice);

  /** @ngInject */
  // function dtservice($http, appConfig, $log) {
    function dtservice($http, appConfig) {

    this.apiMethod = function() {
      return $http({
        method: 'GET',
        url: appConfig.baseUrl + '/stream/between/1/10'
      }).then(function successCallback(response) {
        //Push objects to data array
        return response;
        // this callback will be called asynchronously
        // when the response is available
      }, function errorCallback(response) {
        return response;
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
    }
  }

})();
