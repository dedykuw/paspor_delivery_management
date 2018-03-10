/**
 * Created by tekwan on 3/8/2018.
 */
var bookshelf = require('../config/bookshelf');
var Delivery = require('../models/Delivery');
var Deliveries = bookshelf.Collection.extend({
    model : Delivery
});
module.exports = bookshelf.model('Deliveries', Deliveries);
