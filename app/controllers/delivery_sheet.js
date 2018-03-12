/**
 * Created by tekwan on 3/10/2018.
 */
angular.module('MyApp')
    .controller('DeliverySheetController', function($scope, $rootScope, Delivery, DELIVERY_CONST) {
        $scope.profile = $rootScope.currentUser;
        init();

        function init() {
            Delivery.getDeliveries().then(function (deliveries) {
                console.log(deliveries);
            })
        }
    });