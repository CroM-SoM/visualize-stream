'use strict';

angular.module('angularMaterialAdmin', ['ngAnimate', 'ngCookies',
        'ngSanitize', 'ui.router', 'ngMaterial', 'nvd3', 'app'])

    .config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider,
                      $mdIconProvider) {
        $stateProvider
            .state('site', {
                abstract: true,
                templateUrl: 'app/views/main.html',
                controller: 'MainController',
                controllerAs: 'vm'
            })
            .state('Home', {
                parent: 'site',
                url: '/home',
                templateUrl: 'app/views/home.html',
                controller: 'MainController',
                controllerAs: 'vm',
                data: {
                    title: 'Home'
                }
            });

        $urlRouterProvider.otherwise('Home');
    })


    .run(function ($rootScope, $state, $http, appConf) {

        $rootScope.$on('$stateChangeStart', function (event, next, nextParams, previous, fromParams) {

        })
    })

    .value('appConf', {
        baseURL: 'http://localhost:8080'
    })