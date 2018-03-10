var EXPEDITION = require('../CONST/EXPEDITION_CONST');
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table(EXPEDITION.TABLE_NAME, function(table) {
            table.renameColumn(EXPEDITION.FIELDS.EXPEDITION_ID, EXPEDITION.FIELDS.ID)
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table(EXPEDITION.TABLE_NAME, function(table) {
            table.renameColumn(EXPEDITION.FIELDS.ID, EXPEDITION.FIELDS.EXPEDITION_ID);
        })
    ]);
};
