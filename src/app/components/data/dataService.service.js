(function() {
    'use strict';

    angular
        .module('src')
        .service('dataService', ['$http', 'appConfig', '$log',
            dataService
        ]);

    /** @ngInject */
    function dataService($http, appConfig, $log) {

        return {
            apiMethod: function() {

                this.dataModel = [];

                $http({
                    method: 'GET',
                    url: appConfig.baseUrl + '/data'
                }).then(function successCallback(response) {
                    // $log.log(response);
                    //Push objects to data array
                    this.dataModel.push(response);
                    //console.log(this.dataModel);
                    return this.dataModel;
                    // this callback will be called asynchronously
                    // when the response is available
                }, function errorCallback(response) {
                    $log.log(response);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            }
        }
    }

})();
