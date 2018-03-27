/**
 * Created by tekwan on 3/10/2018.
 */
angular.module('MyApp')
    .factory('Delivery', function($http, DELIVERY_CONST, uiGridConstants) {
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
    });