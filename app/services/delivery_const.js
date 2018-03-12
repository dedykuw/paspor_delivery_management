/**
 * Created by tekwan on 3/10/2018.
 */
angular.module('MyApp')
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