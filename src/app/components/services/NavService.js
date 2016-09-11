(function(){
  'use strict';

  angular.module('app')
          .service('navService', [
          '$q',
          navService
  ]);

  function navService($q){
    var menuItems = [
      {
        name: 'Home',
        icon: 'home',
        sref: 'home'
      },
      {
        name: 'tap1',
        icon: 'alert-circle-outline',
        sref: 'tab1'
      },
      {
        name: 'tab2',
        icon: 'alert-circle-outline',
        sref: 'tab2'
      },
      {
        name: 'tab3',
        icon: 'alert-circle-outline',
        sref: 'tab3'
      }
    ];

    return {
      loadAllItems : function() {
        return $q.when(menuItems);
      }
    };
  }

})();
