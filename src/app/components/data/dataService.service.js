(function () {
  'use strict';

  angular
    .module('test')
    .service('dataService', dtservice);

  /** @ngInject */
  // function dtservice($http, appConfig, $log) {
    function dtservice($http, appConfig, $log) {
    
    this.apiMethod = function() {
      return $http({
        method: 'GET',
        url: appConfig.baseUrl + '/stream/data/1/10'
      }).then(function successCallback(response) {
        //Push objects to data array
        $log.log(response);
        // this callback will be called asynchronously
        // when the response is available
      }, function errorCallback(response) {
        $log.log(response);
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
    }
  }

})();