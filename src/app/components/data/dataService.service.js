(function () {
  'use strict';

  angular
    .module('test')
    .service('dataService', dtservice);

  /** @ngInject */
  function dtservice($http, appConfig, $log) {

    var  dataModel = [];

    this.apiMethod = apiMethod;

    function apiMethod() {
      $http({
        method: 'GET',
        url: appConfig.baseUrl + '/stream/data'
      }).then(function successCallback(response) {
        // $log.log(response);
        //Push objects to data array
        dataModel.push(response);
        //console.log(dataModel);
        return dataModel;
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
