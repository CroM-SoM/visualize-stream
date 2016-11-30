(function() {
    'use strict';

    angular
        .module('test')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('/form', '/form/site');
        $urlRouterProvider.otherwise('/form/site');
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'app/main/main.html',
                controller: 'MainController',
                controllerAs: 'main'
            })
            .state('form', {
                url: '/form',
                templateUrl: 'app/components/feedback/form.html',
                controller: 'MainController',
                controllerAs: 'main'
            })
            // nested states 
            // each of these sections will have their own view
            // url will be nested (/form/profile)
            // url will be /form/payment
            .state('form.site', {
                url: '/site',
                templateUrl: 'app/components/feedback/form-site.html'
            })
            .state('form.link', {
                url: '/link',
                templateUrl: 'app/components/feedback/form-link.html'
            })
            // url will be /form/explanation
            .state('form.explanation', {
                url: '/explanation',
                templateUrl: 'app/components/feedback/form-explanation.html'
            })
            // url will be /form/explanation1
            .state('form.explanation1', {
                url: '/explanation1',
                templateUrl: 'app/components/feedback/form-explanation1.html'
            })
            // url will be /form/thanks
            .state('form.thanks', {
                url: '/thanks',
                templateUrl: 'app/components/feedback/form-thanks.html'
            });
    }

})();
