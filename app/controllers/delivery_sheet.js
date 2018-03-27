/**
 * Created by tekwan on 3/10/2018.
 */
angular.module('MyApp')
    .controller('DeliverySheetController', function($scope, $rootScope, Delivery, CLIENT_CONST,uiGridConstants) {
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

    });