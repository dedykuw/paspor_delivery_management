/**
 * Created by tekwan on 3/8/2018.
 */
var bookshelf = require('../config/bookshelf');
var DELIVERY_CONST = require('../CONST/DELIVERY_HISTORY_CONST');
var CLIENT = require('../CONST/CLIENT_CONST');
var EXPEDITION = require('../CONST/EXPEDITION_CONST');
var Expedition = require('../models/Expedition');

var Delivery = bookshelf.Model.extend({
    tableName: DELIVERY_CONST.TABLE_NAME,
    hasTimestamps: true,
    client : function () {
        return this.belongsTo('Client', DELIVERY_CONST.FIELDS.CLIENT_ID)
    },
    expedition : function () {
        return this.belongsTo(Expedition, DELIVERY_CONST.FIELDS.EXPEDITION)
    }
}, staticFunct());
function staticFunct() {
    function byPassportNumber(number) {
        var whereParams = {};
        whereParams[CLIENT.FIELDS.PASPORT_NUMBER] = number;
        return this.forge().query({where: whereParams }).fetch();
    }
    function createOne(data, options) {
        return this.forge(data).save(null, options);
    }
    function updateOne(data, where) {
        return this.forge().where(where).save(data,{method:"update"});
    }
    function deleteOne(where) {
        return this.forge().where(where).destroy({require : true});
    }
    return {
        byPassportNumber : byPassportNumber,
        createOne : createOne,
        updateOne : updateOne,
        deleteOne : deleteOne
    }
}
module.exports = bookshelf.model('Delivery', Delivery);