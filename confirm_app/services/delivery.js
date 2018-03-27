/**
 * Created by tekwan on 3/10/2018.
 */
angular.module('MyConfirmApp')
    .factory('Delivery', function($http) {
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
    });