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