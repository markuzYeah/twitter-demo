'use strict';


window.APP = angular.module('clorideApp', ['$strap.directives'])
  .config(function($routeProvider, $locationProvider){
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/leaf', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/pin', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({redirecTo: '/'});
  });


