var DELIVERY_HISTORY = require('../CONST/DELIVERY_HISTORY_CONST.js');
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table(DELIVERY_HISTORY.TABLE_NAME, function(table) {
            table.integer(DELIVERY_HISTORY.FIELDS.STATUS)
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table(DELIVERY_HISTORY.TABLE_NAME, function(table) {
            table.dropColumn(DELIVERY_HISTORY.FIELDS.STATUS);
        })
    ]);
};
