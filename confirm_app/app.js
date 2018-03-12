angular.module('MyConfirmApp', ['ngRoute'])
  .config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $routeProvider
      .when('/confirm', {
          templateUrl: 'partials/confirm.html',
          controller: 'ConfirmAppConfirmCtrl'
      })
      .otherwise({
        templateUrl: 'partials/404.html'
      });

  });
