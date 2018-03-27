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