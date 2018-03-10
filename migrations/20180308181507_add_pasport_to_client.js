var CLIENT = require('../CONST/CLIENT_CONST');
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table(CLIENT.TABLE_NAME, function(table) {
            table.string(CLIENT.FIELDS.PASPORT_NUMBER)
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table(CLIENT.TABLE_NAME, function(table) {
            table.dropColumn(CLIENT.FIELDS.PASPORT_NUMBER);
        })
    ]);
};
