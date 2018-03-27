/**
 * Created by tekwan on 3/8/2018.
 */
var DELIVERY_HISTORY_CONST = {
    TABLE_NAME : 'deliveries',
    FIELDS : {
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
    },
    STATUS : {
        RECEIVED : 4,
        SENDING : 3,
        PUBLISHING : 2,
        NEW_REQUEST : 1
    }
};
module.exports = DELIVERY_HISTORY_CONST;