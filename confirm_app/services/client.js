/**
 * Created by tekwan on 3/10/2018.
 */
/**
 * Created by tekwan on 3/10/2018.
 */
angular.module('MyConfirmApp')
    .factory('Client', function($http) {
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
    });