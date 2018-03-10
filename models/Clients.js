/**
 * Created by tekwan on 3/8/2018.
 */
var bookshelf = require('../config/bookshelf');
var Client = require('../models/Client');
var Clients = bookshelf.Collection.extend({
    model : Client
});

module.exports = bookshelf.model('Clients', Clients);