var CLIENT = require('../CONST/CLIENT_CONST');
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table(CLIENT.TABLE_NAME, function(table) {
            table.dropColumn(CLIENT.FIELDS.PHONE_NUMBER);
            table.dropColumn(CLIENT.FIELDS.ADDRESS_TW);
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table(CLIENT.TABLE_NAME, function(table) {
            table.string(CLIENT.FIELDS.PHONE_NUMBER);
            table.string(CLIENT.FIELDS.ADDRESS_TW);
        })
    ]);
};
