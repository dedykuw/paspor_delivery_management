var DELIVERY_HISTORY = require('../CONST/DELIVERY_HISTORY_CONST.js');
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable(DELIVERY_HISTORY.TABLE_NAME, function(table) {
            table.increments();
            table.string(DELIVERY_HISTORY.FIELDS.CLIENT_ID);
            table.integer(DELIVERY_HISTORY.FIELDS.EXPEDITION);
            table.string(DELIVERY_HISTORY.FIELDS.EXPEDITION_NO).unique();
            table.integer(DELIVERY_HISTORY.FIELDS.INPUT_BY);
            table.date(DELIVERY_HISTORY.FIELDS.DELIVERY_DATE);
            table.date(DELIVERY_HISTORY.FIELDS.RECEIVED_DATE);
            table.timestamps();
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable(DELIVERY_HISTORY.TABLE_NAME)
    ])
};
