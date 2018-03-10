var CLIENT_CONST = require('../CONST/CLIENT_CONST.js');
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable(CLIENT_CONST.TABLE_NAME, function(table) {
            table.increments();
            table.string(CLIENT_CONST.FIELDS.NAME);
            table.string(CLIENT_CONST.FIELDS.ADDRESS_IDR);
            table.string(CLIENT_CONST.FIELDS.ADDRESS_TW);
            table.string(CLIENT_CONST.FIELDS.PHONE_NUMBER);
            table.date(CLIENT_CONST.FIELDS.BIRTH_DATE);
            table.string(CLIENT_CONST.FIELDS.KTP).unique();
            table.string(CLIENT_CONST.FIELDS.ARC).unique();
            table.timestamps();
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable(CIENT_CONST.TABLE_NAME)
    ])
};
