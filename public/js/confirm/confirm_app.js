angular.module('MyConfirmApp', ['ngRoute'])
  .config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
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

  }]);

/**
 * Created by tekwan on 3/10/2018.
 */
angular.module('MyConfirmApp')
    .controller('ConfirmAppConfirmCtrl', ["$scope", "$rootScope", "Delivery", "DELIVERY_CONST", "Client", "CLIENT_CONST", function($scope, $rootScope, Delivery, DELIVERY_CONST, Client, CLIENT_CONST) {

        $scope.getStepTemplate = getStepTemplate ;
        $scope.gotoStep = gotoStep;
        $scope.search = searchPaspor;
        $scope.confirmDelivery = confirmDelivery;
        $scope.currentStep = 1;
        $scope.steps = _getStep();
        $scope.client = {};
        $scope.formValid = false;
        $scope.pasportReceived = false;
        $scope.delivery = {};


        function gotoStep(newStep) {
            $scope.currentStep = newStep;
        }
        function getStepTemplate(){
            for (var i = 0; i < $scope.steps.length; i++) {
                if ($scope.currentStep == $scope.steps[i].step) {
                    return $scope.steps[i].template;
                }
            }
        }
        function searchPaspor(isValid) {
            if (isValid){
                _showLoadingBar();
                Delivery.checkDeliveryByPasporAndName($scope.client)
                    .then(function (Delivery) {
                            console.log(Delivery);
                            _hideLoadingBar();
                            if (Delivery.data.exist == 1) {
                                gotoStep(2);
                                $scope.delivery.id = Delivery.data.id;
                            }
                        },
                        function (err) {
                            _hideLoadingBar();
                        })
            }

        }

        function confirmDelivery() {
            _showLoadingBar();

            $scope.delivery.status = 1;
            Delivery.confirmPasporDelivery($scope.delivery)
                .then(function (Delivery) {
                        _hideLoadingBar();
                        if (Delivery.data.success == 1) {
                            $scope.pasportReceived = true;
                        }
                    },
                    function () {
                        _hideLoadingBar();
                    })
        }

        // private function
        function _showLoadingBar() {
            var modalOptions = {
                backdrop : 'static',
                keyboard : false,
                show : true
            };
            angular.element('#myModal').modal(modalOptions);
        }
        function _hideLoadingBar() {
            angular.element('#myModal').modal('hide');
        }
        function _getStep() {
            return [
                {
                    step: 1,
                    name: "Cari Paspor",
                    template: "partials/confirm_search.html"
                },
                {
                    step: 2,
                    name: "Konfirmasi",
                    template: "partials/confirmation_prompt.html"
                }
            ];
        }
    }]);
angular.module('MyConfirmApp')
  .controller('ConfirmAppHeaderCtrl', ["$scope", "$location", "$window", "$auth", function($scope, $location, $window, $auth) {
  }]);

/**
 * Created by tekwan on 3/10/2018.
 */
/**
 * Created by tekwan on 3/10/2018.
 */
angular.module('MyConfirmApp')
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
angular.module('MyConfirmApp')
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
            ID : 'id',
            PASPORT_CHAR_LENGTH : 8
        };
    });
/**
 * Created by tekwan on 3/10/2018.
 */
angular.module('MyConfirmApp')
    .factory('Delivery', ["$http", function($http) {
        var folder = '/api/delivery';
        return {
            updateDelivery: function(data) {
                return $http.post(folder+'/update', data);
            },
            checkDeliveryByPasporAndName: function(data) {
                return $http.post(folder+'/check_active_delivery', data);
            },
            deleteDelivery: function(data) {
                return $http.post(folder+'/delete',data);
            },
            addDelivery: function(data) {
                return $http.post(folder+'/new', data);
            },
            getDeliveries : function () {
                return $http.get(folder+'/deliveries')
            },
            confirmPasporDelivery : function (data) {
                return $http.post(folder+'/confirm_delivery',data)
            }
        };
    }]);
/**
 * Created by tekwan on 3/10/2018.
 */
angular.module('MyConfirmApp')
    .constant('DELIVERY_CONST', function() {
        return {
            CLIENT_ID : 'client_id',
            EXPEDITION : 'expedition_id',
            EXPEDITION_NO : 'expedition_no',
            INPUT_BY : 'user_id',
            DELIVERY_DATE : 'delivery_date',
            RECEIVED_DATE : 'received_date',
            STATUS : 'status',
            ADDRESS : 'address',
            PHONE_NUMBER : 'phone_no',
            ID : 'id'
        };
    });
/**
 * Created by tekwan on 3/10/2018.
 */
angular.module('MyConfirmApp')
    .constant('EXPEDITION_CONST', function() {
        return {
            EXPEDITION_ID : 'exp_id',
            ID : 'id',
            EXPEDITION_NAME : 'name',
            ADDRESS : 'address'
        };
    });