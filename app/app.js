angular.module('MyApp', [
    'ngRoute',
    'satellizer',
    'ui.bootstrap',
    'ui.grid',
    'ui.grid.moveColumns',
    'ui.grid.saveState',
    'angular-loading-bar',
    'ui.grid.pagination',
    'moment-picker',
    'angularMoment'])
    .config(function($routeProvider, $locationProvider, $authProvider,cfpLoadingBarProvider, momentPickerProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $routeProvider
            .when('/', {
                templateUrl: 'partials/home.html'
            })
            .when('/contact', {
                templateUrl: 'partials/contact.html',
                controller: 'ContactCtrl'
            })
            .when('/login', {
                templateUrl: 'partials/login.html',
                controller: 'LoginCtrl',
                resolve: { skipIfAuthenticated: skipIfAuthenticated }
            })
            .when('/signup', {
                templateUrl: 'partials/signup.html',
                controller: 'SignupCtrl',
                resolve: { skipIfAuthenticated: skipIfAuthenticated }
            })
            .when('/account', {
                templateUrl: 'partials/profile.html',
                controller: 'ProfileCtrl',
                resolve: { loginRequired: loginRequired }
            })
            .when('/confirm', {
                templateUrl: 'partials/confirm.html',
                controller: 'ConfirmCtrl'
            })
            .when('/forgot', {
                templateUrl: 'partials/forgot.html',
                controller: 'ForgotCtrl',
                resolve: { skipIfAuthenticated: skipIfAuthenticated }
            })
            .when('/delivery_sheet', {
                templateUrl: 'partials/delivery_sheet.html',
                controller: 'DeliverySheetController',
                resolve: { loginRequired : loginRequired }
            })
            .when('/reset/:token', {
                templateUrl: 'partials/reset.html',
                controller: 'ResetCtrl',
                resolve: { skipIfAuthenticated: skipIfAuthenticated }
            })
            .otherwise({
                templateUrl: 'partials/404.html'
            });

        $authProvider.loginUrl = '/login';
        $authProvider.signupUrl = '/signup';

        function skipIfAuthenticated($location, $auth) {
            if ($auth.isAuthenticated()) {
                $location.path('/');
            }
        }

        function loginRequired($location, $auth) {
            if (!$auth.isAuthenticated()) {
                $location.path('/login');
            }
        }

        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.latencyThreshold = 1;

        momentPickerProvider.options({
            /* Picker properties */
            locale:        'en',
            format:        'L LTS',
            minView:       'decade',
            maxView:       'minute',
            startView:     'day',
            autoclose:     true,
            today:         false,
            keyboard:      false,

            /* Extra: Views properties */
            leftArrow:     '&larr;',
            rightArrow:    '&rarr;',
            yearsFormat:   'YYYY',
            monthsFormat:  'MMM',
            daysFormat:    'D',
            hoursFormat:   'HH:[00]',
            minutesFormat: moment.localeData().longDateFormat('LT').replace(/[aA]/, ''),
            secondsFormat: 'ss',
            minutesStep:   5,
            secondsStep:   1
        });
    })
    .run(function($rootScope, $window) {
        if ($window.localStorage.user) {
            $rootScope.currentUser = JSON.parse($window.localStorage.user);
        }
    });
