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
    .config(["$routeProvider", "$locationProvider", "$authProvider", "cfpLoadingBarProvider", "momentPickerProvider", function($routeProvider, $locationProvider, $authProvider,cfpLoadingBarProvider, momentPickerProvider) {
        skipIfAuthenticated.$inject = ["$location", "$auth"];
        loginRequired.$inject = ["$location", "$auth"];
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
    }])
    .run(["$rootScope", "$window", function($rootScope, $window) {
        if ($window.localStorage.user) {
            $rootScope.currentUser = JSON.parse($window.localStorage.user);
        }
    }]);

/**
 * Created by tekwan on 3/10/2018.
 */
angular.module('MyApp')
    .controller('ConfirmCtrl', ["$scope", "$rootScope", "Delivery", "DELIVERY_CONST", "Client", "CLIENT_CONST", function($scope, $rootScope, Delivery, DELIVERY_CONST, Client, CLIENT_CONST) {

    }]);
angular.module('MyApp')
  .controller('ContactCtrl', ["$scope", "Contact", function($scope, Contact) {
    $scope.sendContactForm = function() {
      Contact.send($scope.contact)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };
  }]);

/**
 * Created by tekwan on 3/10/2018.
 */
angular.module('MyApp')
    .controller('DeliverySheetController', ["$scope", "$rootScope", "Delivery", "CLIENT_CONST", "uiGridConstants", function($scope, $rootScope, Delivery, CLIENT_CONST,uiGridConstants) {
        $scope.profile = $rootScope.currentUser;
        init();

        $scope.gridColumn = {
            enableFiltering: true,
            paginationPageSizes: [20],
            enableScrollbars : false,
            enableVerticalScrollbars : false,
            enableHorizontalScrollbars : false,
            multiSelect : false,
            columnDefs: Delivery.getFieldConfigurations(),
            onRegisterApi: function(gridApi) {
                $scope.uiGridApi = gridApi;
                //$scope.uiGridApi.grid.registerRowsProcessor( rowFilter, 200 );
            }

        };

        function init() {
            Delivery.getDeliveries().then(function (deliveries) {
                $scope.gridColumn.data = deliveries.data;
                $scope.uiGridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
            })
        }

    }]);
angular.module('MyApp')
  .controller('ForgotCtrl', ["$scope", "Account", function($scope, Account) {
    $scope.forgotPassword = function() {
      Account.forgotPassword($scope.user)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };
  }]);

angular.module('MyApp')
  .controller('HeaderCtrl', ["$scope", "$location", "$window", "$auth", function($scope, $location, $window, $auth) {
    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
    
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };
    
    $scope.logout = function() {
      $auth.logout();
      delete $window.localStorage.user;
      $location.path('/');
    };
  }]);

angular.module('MyApp')
  .controller('LoginCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", function($scope, $rootScope, $location, $window, $auth) {
    $scope.login = function() {
      $auth.login($scope.user)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/account');
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function(response) {
          if (response.error) {
            $scope.messages = {
              error: [{ msg: response.error }]
            };
          } else if (response.data) {
            $scope.messages = {
              error: [response.data]
            };
          }
        });
    };
  }]);
angular.module('MyApp')
  .controller('ProfileCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", "Account", function($scope, $rootScope, $location, $window, $auth, Account) {
    $scope.profile = $rootScope.currentUser;

    $scope.updateProfile = function() {
      Account.updateProfile($scope.profile)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.changePassword = function() {
      Account.changePassword($scope.profile)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.link = function(provider) {
      $auth.link(provider)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $window.scrollTo(0, 0);
          $scope.messages = {
            error: [response.data]
          };
        });
    };
    $scope.unlink = function(provider) {
      $auth.unlink(provider)
        .then(function() {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: [response.data]
          };
        });
    };

    $scope.deleteAccount = function() {
      Account.deleteAccount()
        .then(function() {
          $auth.logout();
          delete $window.localStorage.user;
          $location.path('/');
        })
        .catch(function(response) {
          $scope.messages = {
            error: [response.data]
          };
        });
    };
  }]);
angular.module('MyApp')
  .controller('ResetCtrl', ["$scope", "Account", function($scope, Account) {
    $scope.resetPassword = function() {
      Account.resetPassword($scope.user)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    }
  }]);

angular.module('MyApp')
  .controller('SignupCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", function($scope, $rootScope, $location, $window, $auth) {
    $scope.signup = function() {
      $auth.signup($scope.user)
        .then(function(response) {
          $auth.setToken(response);
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function(response) {
          if (response.error) {
            $scope.messages = {
              error: [{ msg: response.error }]
            };
          } else if (response.data) {
            $scope.messages = {
              error: [response.data]
            };
          }
        });
    };
  }]);
angular.module('MyApp')
  .factory('Account', ["$http", function($http) {
    return {
      updateProfile: function(data) {
        return $http.put('/account', data);
      },
      changePassword: function(data) {
        return $http.put('/account', data);
      },
      deleteAccount: function() {
        return $http.delete('/account');
      },
      forgotPassword: function(data) {
        return $http.post('/forgot', data);
      },
      resetPassword: function(data) {
        return $http.post('/reset', data);
      }
    };
  }]);
/**
 * Created by tekwan on 3/10/2018.
 */
/**
 * Created by tekwan on 3/10/2018.
 */
angular.module('MyApp')
    .factory('Client', ["$http", function($http) {
        var folder = '/api/delivery';
        return {
            updateDelivery: function(data) {
                return $http.post(folder+'/update', data);
            },
            deleteDelivery: function(data) {
                return $http.post(folder+'/delete',data);
            },
            addDelivery: function(data) {
                return $http.post(folder+'/new', data);
            },
            getDeliveries : function () {
                return $http.get(folder+'/deliveries')
            }
        };
    }]);
/**
 * Created by tekwan on 3/10/2018.
 */
angular.module('MyApp')
    .constant('CLIENT_CONST', function() {
        return {
            NAME : 'name',
            ADDRESS_TW : 'address_tw',
            ADDRESS_IDR : 'address_idr',
            ARC : 'arc',
            KTP : 'ktp',
            BIRTH_DATE : 'user_id',
            PHONE_NUMBER : 'phone_number',
            PASPORT_NUMBER : 'pasport_no',
            ID : 'id'
        };
    });
angular.module('MyApp')
  .factory('Contact', ["$http", function($http) {
    return {
      send: function(data) {
        return $http.post('/contact', data);
      }
    };
  }]);
/**
 * Created by tekwan on 3/10/2018.
 */
angular.module('MyApp')
    .factory('Delivery', ["$http", "DELIVERY_CONST", "uiGridConstants", function($http, DELIVERY_CONST, uiGridConstants) {
        var folder = '/api/delivery';
        var services = {
            updateDelivery: updateDelivery,
            deleteDelivery: deleteDelivery,
            addDelivery: addDelivery,
            getDeliveries : getDeliveries,
            getFieldConfigurations : getFieldConfigurations
        };
        function getNullTemplate(entity, defaultValue) {
            var template = '<div class="ui-grid-cell-contents" ng-if="row.entity.'+entity+'">{{row.entity.'+entity+'}}</div>' +
                '<div class="ui-grid-cell-contents" ng-if="!row.entity.'+entity+'">'+defaultValue+'</div>';
            return template

        }
        function getStatusTemplate() {
            var template =  '<div class="ui-grid-cell-contents" ng-switch="row.entity.status">' +
                '<span ng-switch-default>Tidak Ada Status</span>' +
                '<span class="badge badge-success" ng-switch-when="'+DELIVERY_CONST.STATUS.RECEIVED+'">'+DELIVERY_CONST.STATUS.RECEIVED_LABEL+'</span>' +
                '<span class="badge badge-danger" ng-switch-when="'+DELIVERY_CONST.STATUS.PUBLISHING+'">'+DELIVERY_CONST.STATUS.PUBLISHING_LABEL+'</span>' +
                '<span class="badge badge-warning" ng-switch-when="'+DELIVERY_CONST.STATUS.SENDING+'">'+DELIVERY_CONST.STATUS.SENDING_LABEL+'</span>' +
                '<span class="badge badge-secondary" ng-switch-when="'+DELIVERY_CONST.STATUS.NEW_REQUEST+'">'+DELIVERY_CONST.STATUS.NEW_REQUEST_LABEL+'</span> </div>';
            return template;
        }
        function getFieldConfigurations() {
            var fields = [
                {
                    field: 'id', name: 'No', cellTemplate : getNullTemplate('id', 'Tidak ada data'), maxWidth : '40', headerCellClass: highlightFilteredHeader
                },
                {
                    field: 'delivery_date', name: 'Pengiriman', cellFilter: 'date:\'dd-MM-yyyy\'', maxWidth: '150', headerCellClass: highlightFilteredHeader, enableFiltering: true,
                    cellTemplate : "<div class='ui-grid-cell-contents'>{{COL_FIELD | date:'dd-MM-yyyy'}}</div>",
                    filterHeaderTemplate: 'partials/ui-grid-header-date-filter.html',
                    filters: [
                        {
                            name : 'from',
                            condition: function(term, value, row, column){
                                if (!term) return true;
                                var valueDate = new Date(value);
                                return valueDate >= term;
                            },
                            placeholder: 'Greater than or equal'
                        },
                        {
                            name : 'to',
                            condition: function(term, value, row, column){
                                if (!term) return true;
                                var valueDate = new Date(value);
                                return valueDate <= term;
                            },
                            placeholder: 'Less than or equal'
                        }
                    ]
                },
                {
                    field: 'client.name', name: 'Nama', cellTemplate : getNullTemplate('client.name', 'Tidak ada data'), headerCellClass: highlightFilteredHeader
                },
                {
                    field: 'client.pasport_no', name: 'Paspor', cellTemplate : getNullTemplate('client.pasport_no', 'Tidak ada data'), headerCellClass: highlightFilteredHeader
                },
                {
                    field: 'client.name', name: 'Penerima', cellTemplate : getNullTemplate('client.name', 'Tidak ada data'), headerCellClass: highlightFilteredHeader
                },
                {
                    field: 'phone_no', name: 'Telpon', cellTemplate : getNullTemplate('phone_no', 'Tidak ada data'), headerCellClass: highlightFilteredHeader
                },
                {
                    field: 'expedition_no', name: 'No. Eksped', cellTemplate : getNullTemplate('expedition_no', 'Tidak ada data') , headerCellClass: highlightFilteredHeader
                },
                {
                    field: 'status', name: 'status', cellTemplate : getStatusTemplate(), headerCellClass: highlightFilteredHeader,
                    filter: {
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: [
                            { value: DELIVERY_CONST.STATUS.NEW_REQUEST, label: DELIVERY_CONST.STATUS.NEW_REQUEST_LABEL },
                            { value: DELIVERY_CONST.STATUS.PUBLISHING, label: DELIVERY_CONST.STATUS.PUBLISHING_LABEL },
                            { value: DELIVERY_CONST.STATUS.SENDING, label: DELIVERY_CONST.STATUS.SENDING_LABEL},
                            { value: DELIVERY_CONST.STATUS.RECEIVED, label: DELIVERY_CONST.STATUS.RECEIVED_LABEL }]
                    }
                }
            ];
            return fields;
        }
        function rowFilter( renderableRows ){
            renderableRows.forEach( function( row ) {
            });
            return renderableRows;
        }
        function highlightFilteredHeader( row, rowRenderIndex, col, colRenderIndex ) {
            if( col.filters[0].term ){
                return 'header-filtered';
            } else {
                return '';
            }
        };
        function updateDelivery(data) {
            return $http.post(folder+'/update', data);
        }
        function deleteDelivery(data) {
                return $http.post(folder+'/delete',data);
        }
        function addDelivery(data) {
            return $http.post(folder+'/new', data);
        }
        function getDeliveries() {
            return $http.get(folder+'/deliveries')
        }
        return services;
    }]);
/**
 * Created by tekwan on 3/10/2018.
 */
angular.module('MyApp')
    .constant('DELIVERY_CONST',  {
            CLIENT_ID : 'client_id',
            EXPEDITION : 'expedition_id',
            EXPEDITION_NO : 'expedition_no',
            INPUT_BY : 'user_id',
            DELIVERY_DATE : 'delivery_date',
            RECEIVED_DATE : 'received_date',
            STATUS : 'status',
            ADDRESS : 'address',
            PHONE_NUMBER : 'phone_no',
            ID : 'id',
            STATUS : {
                RECEIVED : 4,
                SENDING : 3,
                PUBLISHING : 2,
                NEW_REQUEST : 1,
                NEW_REQUEST_LABEL : 'Data Baru',
                RECEIVED_LABEL : 'Diterima',
                SENDING_LABEL : 'Dkirim',
                PUBLISHING_LABEL : 'Sedang Dicetak',
            }
    });
/**
 * Created by tekwan on 3/10/2018.
 */
angular.module('MyApp')
    .constant('EXPEDITION_CONST', function() {
        return {
            EXPEDITION_ID : 'exp_id',
            ID : 'id',
            EXPEDITION_NAME : 'name',
            ADDRESS : 'address'
        };
    });
/**
 * Created by tekwan on 3/26/2018.
 */
angular
    .module('MyApp')
.controller('gridDatePickerFilterCtrl', ['$scope', '$timeout', '$uibModal', 'uiGridConstants', 'moment', function( $scope, $timeout, $uibModal, uiGridConstants, moment) {
    $timeout(function() {
        console.log($scope.col);
        var field = $scope.col.colDef.field;
        var allDates = $scope.col.grid.appScope.gridColumn.data.map(function(datum) {
            return moment(datum[field]);
        });
        var minDate = moment.min(allDates);
        var maxDate = moment.max(allDates);
        $scope.openDatePicker = function(filter) {
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/custom-date-filter.html',
                controller: 'customGridDateFilterModalCtrl as custom',
                size: 'md',
                windowClass: 'custom-date-filter-modal',
                resolve: {
                    filterName: [function() {
                        return filter.name;
                    }],
                    minDate: [function() {
                        return new Date(minDate);
                    }],
                    maxDate: [function() {
                        return new Date(maxDate);
                    }]
                }
            });

            modalInstance.result.then(function(selectedDate) {
                $scope.colFilter.listTerm = [];
                $scope.colFilter.term = new Date(selectedDate);
            });
        };

    });


}])
    .controller('customGridDateFilterModalCtrl', ['$scope', '$rootScope', '$log', '$uibModalInstance', 'filterName', 'minDate', 'maxDate', function($scope, $rootScope, $log, $uibModalInstance, filterName, minDate, maxDate) {

        var custom = this;
        custom.title = 'Select Dates ' + filterName + '...';
        custom.minDate = minDate;
        custom.maxDate = maxDate;
        custom.customDateFilterForm;

        custom.filterDate = (filterName.indexOf('From') !== -1) ? angular.copy(custom.minDate) : angular.copy(custom.maxDate);
        function setDateToStartOfDay(date) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }

        function setDateToEndOfDay(date) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
        }

        custom.filterDateChanged = function () {
            custom.filterDate = (filterName.indexOf('From') !== -1) ? setDateToStartOfDay(custom.filterDate) : setDateToEndOfDay(custom.filterDate);
            $log.log('new filter date', custom.filterDate);
        };

        custom.setFilterDate = function(date) {
            $uibModalInstance.close(date);
        };

        custom.cancelDateFilter = function() {
            $uibModalInstance.dismiss();
        };

    }]);
angular
    .module('MyApp')
    .directive('includeReplace', includeReplace)
    .directive('a', preventClickDirective)
    .directive('a', bootstrapCollapseDirective)
    .directive('a', navigationDirective)
    .directive('button', layoutToggleDirective)
    .directive('a', layoutToggleDirective)
    .directive('button', collapseMenuTogglerDirective)
    .directive('div', bootstrapCarouselDirective)
    .directive('toggle', bootstrapTooltipsPopoversDirective)
    .directive('tab', bootstrapTabsDirective)
    .directive('button', cardCollapseDirective)
    .directive('customGridDateFilterHeader', customGridDateFilterHeader)

function customGridDateFilterHeader() {
    return {
        templateUrl: 'partials/ui-grid-date-range-picker.html',
        controller: 'gridDatePickerFilterCtrl'
    };
}
function includeReplace() {
    var directive = {
        require: 'ngInclude',
        restrict: 'A',
        link: link
    }
    return directive;

    function link(scope, element, attrs) {
        element.replaceWith(element.children());
    }
}

//Prevent click if href="#"
function preventClickDirective() {
    var directive = {
        restrict: 'E',
        link: link
    }
    return directive;

    function link(scope, element, attrs) {
        if (attrs.href === '#'){
            element.on('click', function(event){
                event.preventDefault();
            });
        }
    }
}

//Bootstrap Collapse
function bootstrapCollapseDirective() {
    var directive = {
        restrict: 'E',
        link: link
    }
    return directive;

    function link(scope, element, attrs) {
        if (attrs.toggle=='collapse'){
            element.attr('href','javascript;;').attr('data-target',attrs.href.replace('index.html',''));
        }
    }
}

/**
 * @desc Genesis main navigation - Siedebar menu
 * @example <li class="nav-item nav-dropdown"></li>
 */
function navigationDirective() {
    var directive = {
        restrict: 'E',
        link: link
    }
    return directive;

    function link(scope, element, attrs) {
        if(element.hasClass('nav-dropdown-toggle') && angular.element('body').width() > 782) {
            element.on('click', function(){
                if(!angular.element('body').hasClass('compact-nav')) {
                    element.parent().toggleClass('open').find('.open').removeClass('open');
                }
            });
        } else if (element.hasClass('nav-dropdown-toggle') && angular.element('body').width() < 783) {
            element.on('click', function(){
                element.parent().toggleClass('open').find('.open').removeClass('open');
            });
        }
    }
}

//Dynamic resize .sidebar-nav
sidebarNavDynamicResizeDirective.$inject = ['$window', '$timeout'];
function sidebarNavDynamicResizeDirective($window, $timeout) {
    var directive = {
        restrict: 'E',
        link: link
    }
    return directive;

    function link(scope, element, attrs) {

        if (element.hasClass('sidebar-nav') && angular.element('body').hasClass('fixed-nav')) {
            var bodyHeight = angular.element(window).height();
            scope.$watch(function(){
                var headerHeight = angular.element('header').outerHeight();

                if (angular.element('body').hasClass('sidebar-off-canvas')) {
                    element.css('height', bodyHeight);
                } else {
                    element.css('height', bodyHeight - headerHeight);
                }
            })

            angular.element($window).bind('resize', function(){
                var bodyHeight = angular.element(window).height();
                var headerHeight = angular.element('header').outerHeight();
                var sidebarHeaderHeight = angular.element('.sidebar-header').outerHeight();
                var sidebarFooterHeight = angular.element('.sidebar-footer').outerHeight();

                if (angular.element('body').hasClass('sidebar-off-canvas')) {
                    element.css('height', bodyHeight - sidebarHeaderHeight - sidebarFooterHeight);
                } else {
                    element.css('height', bodyHeight - headerHeight - sidebarHeaderHeight - sidebarFooterHeight);
                }
            });
        }
    }
}

//LayoutToggle
layoutToggleDirective.$inject = ['$interval'];
function layoutToggleDirective($interval) {
    var directive = {
        restrict: 'E',
        link: link
    }
    return directive;

    function link(scope, element, attrs) {
        element.on('click', function(){

            if (element.hasClass('sidebar-toggler')) {
                angular.element('body').toggleClass('sidebar-hidden');
            }

            if (element.hasClass('aside-menu-toggler')) {
                angular.element('body').toggleClass('aside-menu-hidden');
            }
        });
    }
}

//Collapse menu toggler
function collapseMenuTogglerDirective() {
    var directive = {
        restrict: 'E',
        link: link
    }
    return directive;

    function link(scope, element, attrs) {
        element.on('click', function(){
            if (element.hasClass('navbar-toggler') && !element.hasClass('layout-toggler')) {
                angular.element('body').toggleClass('sidebar-mobile-show')
            }
        })
    }
}

//Bootstrap Carousel
function bootstrapCarouselDirective() {
    var directive = {
        restrict: 'E',
        link: link
    }
    return directive;

    function link(scope, element, attrs) {
        if (attrs.ride=='carousel'){
            element.find('a').each(function(){
                $(this).attr('data-target',$(this).attr('href').replace('index.html','')).attr('href','javascript;;')
            });
        }
    }
}

//Bootstrap Tooltips & Popovers
function bootstrapTooltipsPopoversDirective() {
    var directive = {
        restrict: 'A',
        link: link
    }
    return directive;

    function link(scope, element, attrs) {
        if (attrs.toggle=='tooltip'){
            angular.element(element).tooltip();
        }
        if (attrs.toggle=='popover'){
            angular.element(element).popover();
        }
    }
}

//Bootstrap Tabs
function bootstrapTabsDirective() {
    var directive = {
        restrict: 'A',
        link: link
    }
    return directive;

    function link(scope, element, attrs) {
        element.click(function(e) {
            e.preventDefault();
            angular.element(element).tab('show');
        });
    }
}

//Card Collapse
function cardCollapseDirective() {
    var directive = {
        restrict: 'E',
        link: link
    }
    return directive;

    function link(scope, element, attrs) {
        if (attrs.toggle=='collapse' && element.parent().hasClass('card-actions')){

            if (element.parent().parent().parent().find('.card-body').hasClass('in')) {
                element.find('i').addClass('r180');
            }

            var id = 'collapse-' + Math.floor((Math.random() * 1000000000) + 1);
            element.attr('data-target','#'+id)
            element.parent().parent().parent().find('.card-body').attr('id',id);

            element.on('click', function(){
                element.find('i').toggleClass('r180');
            })
        }
    }
}