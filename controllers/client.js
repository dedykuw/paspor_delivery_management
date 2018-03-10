var Clients = require('../models/Clients');

exports.getAllClient = getAllClient;

function getAllClient(req,res) {
    Clients.forge().fetch().then(function(clients) {
        res.json(clients.toJSON());
    });
}


