/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('src')
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('appConfig', {
    	baseUrl: 'http://localhost:8080'
    });

})();
