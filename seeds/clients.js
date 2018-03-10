var CLIENT = require('../CONST/CLIENT_CONST');
var client = {};
client[CLIENT.FIELDS.NAME] = 'Sri Sulastri';
client[CLIENT.FIELDS.PHONE_NUMBER] = '082177000028';
client[CLIENT.FIELDS.BIRTH_DATE] = '1990-08-02';
client[CLIENT.FIELDS.KTP] = '150002000122226';
client[CLIENT.FIELDS.ARC] = '1100076';
client[CLIENT.FIELDS.PASPORT_NUMBER] = '242457870';
client[CLIENT.FIELDS.ADDRESS_IDR] = 'Jl. let jend harun sohar 2617';
console.log(client)
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex(CLIENT.TABLE_NAME).del(),

    // Inserts seed entries
    knex(CLIENT.TABLE_NAME).insert(client)
  );
};
