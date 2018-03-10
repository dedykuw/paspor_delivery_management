/**
 * Created by tekwan on 3/8/2018.
 */
var bookshelf = require('../config/bookshelf');
var DELIVERY = require('../CONST/DELIVERY_HISTORY_CONST');
var CLIENT = require('../CONST/CLIENT_CONST');
var EXPEDITION = require('../CONST/EXPEDITION_CONST');

var Expedition = bookshelf.Model.extend({
    tableName: EXPEDITION.TABLE_NAME,
    hasTimestamps: true,
    deliveries : function () {
        return this.hasMany('Delivery')
    },
    clients : function () {
        return this.hasMany('Client').through(DELIVERY.TABLE_NAME)
    }

});

module.exports = bookshelf.model('Expedition', Expedition);
