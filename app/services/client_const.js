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