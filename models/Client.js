/**
 * Created by tekwan on 3/8/2018.
 */
var bookshelf = require('../config/bookshelf');
var DELIVERY = require('../CONST/DELIVERY_HISTORY_CONST');
var CLIENT = require('../CONST/CLIENT_CONST');
var EXPEDITION = require('../CONST/EXPEDITION_CONST');

var Client = bookshelf.Model.extend({
    tableName: CLIENT.TABLE_NAME,
    hasTimestamps: true,
    deliveries : function () {
        return this.hasMany('Delivery', DELIVERY.FIELDS.CLIENT_ID)
    }
}, staticFunct());
function staticFunct() {
    function byPassportNumber(number) {
        var whereParams = {};
        whereParams[CLIENT.FIELDS.PASPORT_NUMBER] = number;
        return this.forge().query({where: whereParams }).fetch();
    }
    function getClient(where, orderBy) {
        if (!orderBy) {
            var orderBy = {};
            orderBy.field = CLIENT.FIELDS.ID;
            orderBy.sort = 'DESC';
        }
        return this.forge().orderBy(orderBy.field, orderBy.sort).where(where).fetch();
    }
    function createOne(data, options) {
            return this.forge(data).save(null, options);
    }
    function updateOne(data, where) {
            return this.forge().where(where).save(data,{method:"update"});
    }
    return {
        byPassportNumber : byPassportNumber,
        createOne : createOne,
        updateOne : updateOne,
        getClient : getClient
    }
}
module.exports = bookshelf.model('Client', Client);