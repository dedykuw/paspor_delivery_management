var EXPEDITION = require('../CONST/EXPEDITION_CONST');
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable(EXPEDITION.TABLE_NAME, function(table) {
            table.increments(EXPEDITION.FIELDS.EXPEDITION_ID);
            table.string(EXPEDITION.FIELDS.EXPEDITION_NAME);
            table.string(EXPEDITION.FIELDS.ADDRESS);
            table.timestamps();
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable(EXPEDITION.TABLE_NAME)
    ])
};
