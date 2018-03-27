var Deliveries = require('../models/Deliveries');
var Delivery = require('../models/Delivery');
var Client = require('../models/Client');
var User = require('../models/User');
var CLIENT_CONST = require('../CONST/CLIENT_CONST');
var DELIVERY_CONST = require('../CONST/DELIVERY_HISTORY_CONST');


exports.getAllDeliveries = getAllDeliveries;
exports.newDeliveryPost = newDeliveryPost;
exports.updateDelivery = updateDelivery;
exports.deleteDelivery = deleteDelivery;
exports.getOneActiveDeliveryByPasportAndName = getOneActiveDeliveryByPasportAndName;
exports.checkActiveDeliveryByPasportAndName = checkActiveDeliveryByPasportAndName;
exports.confirmDelivey = confirmDelivery;
function confirmDelivery(req, res) {
    req.assert(DELIVERY_CONST.FIELDS.ID, 'ID pengiriman harus disertakan');
    req.assert(DELIVERY_CONST.FIELDS.STATUS, 'Status pengiriman harus disertakan');
    var err = req.validationErrors();
    if (err) return res.status(400).send(err);
    console.log('receive delivery confirmation request with id ' + req.body[DELIVERY_CONST.FIELDS.ID] );
    var data = {};
    data[DELIVERY_CONST.FIELDS.STATUS] = req.body[DELIVERY_CONST.FIELDS.STATUS];
    var where = {};
    where[DELIVERY_CONST.FIELDS.ID] = req.body[DELIVERY_CONST.FIELDS.ID];
    _updateDelivery(req, where, data)
        .then(function (Delivery) {
            console.log('Delivery status now '+ Delivery.get(DELIVERY_CONST.FIELDS.STATUS)+ ' with id ' +req.body[DELIVERY_CONST.FIELDS.ID] );
            res.json({ success : 1 });
        })
        .catch(function (err) {
            return res.status(400).send(err)
        })

}
function getOneActiveDeliveryByPasportAndName(req, res) {

    req.assert(CLIENT_CONST.FIELDS.NAME, 'Nama harus terisi').notEmpty();
    req.assert(CLIENT_CONST.FIELDS.PASPORT_NUMBER, 'Paspor harus '+CLIENT_CONST.PASPORT_CHAR_LENGTH+' Karakter').len(CLIENT_CONST.PASPORT_CHAR_LENGTH, CLIENT_CONST.PASPORT_CHAR_LENGTH);
    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }
    console.log('trying to fetch delivery data by pasport number and name ' +req.body[CLIENT_CONST.FIELDS.PASPORT_NUMBER] );
    var where = {};
    where[CLIENT_CONST.FIELDS.PASPORT_NUMBER] = req.body[CLIENT_CONST.FIELDS.PASPORT_NUMBER];
    where[CLIENT_CONST.FIELDS.NAME] = req.body[CLIENT_CONST.FIELDS.NAME];
    _getOneClient(where)
        .then(function (client) {
            if (client == null) return res.status(400).send({msg : 'Data dengan paspor ' +req.body[CLIENT_CONST.FIELDS.PASPORT_NUMBER] + ' tidak ditemukan'});
            console.log('Client found with id' + client.id);
            var whereDelivery = {};
            whereDelivery[DELIVERY_CONST.FIELDS.CLIENT_ID] = client.id;
            whereDelivery[DELIVERY_CONST.FIELDS.STATUS] = 0;
            _getDelivery(whereDelivery)
                .then(function (Delivery) {
                    if (Delivery == null) return res.status(400).send({msg : 'Data pengiriman dengan paspor ' +req.body[CLIENT_CONST.FIELDS.PASPORT_NUMBER] + 'tidak ditemukan'});
                    res.json({ data : Delivery.toJSON()});
                })
                .catch(function (err) {
                    console.log(err);
                    return res.status(400).send(err);
                })
        })
        .catch(function (err) {
            console.log(err);
            return res.status(400).send(err);
        })

}
function checkActiveDeliveryByPasportAndName(req, res) {

    req.assert(CLIENT_CONST.FIELDS.NAME, 'Nama harus terisi').notEmpty();
    req.assert(CLIENT_CONST.FIELDS.PASPORT_NUMBER, 'Paspor harus '+CLIENT_CONST.PASPORT_CHAR_LENGTH+' Karakter').len(CLIENT_CONST.PASPORT_CHAR_LENGTH, CLIENT_CONST.PASPORT_CHAR_LENGTH);
    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }
    console.log('trying to fetch delivery data by pasport number and name ' +req.body[CLIENT_CONST.FIELDS.PASPORT_NUMBER] );
    var where = {};
    where[CLIENT_CONST.FIELDS.PASPORT_NUMBER] = req.body[CLIENT_CONST.FIELDS.PASPORT_NUMBER];
    where[CLIENT_CONST.FIELDS.NAME] = req.body[CLIENT_CONST.FIELDS.NAME];
    _getOneClient(where)
        .then(function (client) {
            var responseData =  {msg : 'Data dengan paspor ' +req.body[CLIENT_CONST.FIELDS.PASPORT_NUMBER] + ' tidak ditemukan',  data : { exist : 0}};
            if (client == null) return res.status(400).send(responseData);
            console.log('Client found with id' + client.id);
            var whereDelivery = {};
            whereDelivery[DELIVERY_CONST.FIELDS.CLIENT_ID] = client.id;
            whereDelivery[DELIVERY_CONST.FIELDS.STATUS] = 0;
            _getDelivery(whereDelivery)
                .then(function (Delivery) {
                    var responseData = {msg : 'Data pengiriman dengan paspor ' +req.body[CLIENT_CONST.FIELDS.PASPORT_NUMBER] + 'tidak ditemukan', data : { exist : 0}};
                    if (Delivery == null) return res.status(400).send(responseData);
                    res.json({
                            exist : 1,
                            id : Delivery.id
                    });
                })
                .catch(function (err) {
                    console.log(err);
                    return res.status(400).send(err);
                })
        })
        .catch(function (err) {
            console.log(err);
            return res.status(400).send(err);
        })

}
function deleteDelivery(req, res) {
    console.log('received a request to delete delivery with id' + req.body[DELIVERY_CONST.FIELDS.ID]);
    req.assert(DELIVERY_CONST.FIELDS.ID, 'Id tidak disisipkan').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }
    console.log('performing deletion');
    var where = {};
    where[DELIVERY_CONST.FIELDS.ID] = req.body[DELIVERY_CONST.FIELDS.ID];
    _removeDelivery(where)
        .then(function (data) {
            console.log('Delivery has been successfully deleted with id ' +req.body[DELIVERY_CONST.FIELDS.ID]);
            res.send({msg : 'Delivery has been successfully deleted with id ' +req.body[DELIVERY_CONST.FIELDS.ID]})
        })
        .catch(function (errors) {
            return res.status(400).send(errors);
        })
}
function updateDelivery(req, res){
    console.log('received a new update delivery req with name ' + req.body[CLIENT_CONST.FIELDS.NAME]);
    req.assert(CLIENT_CONST.FIELDS.NAME, 'Kolom nama harus terisi').notEmpty();
    req.assert(CLIENT_CONST.FIELDS.PASPORT_NUMBER, 'Kolom nomor paspor harus terisi').notEmpty();
    req.assert(DELIVERY_CONST.FIELDS.DELIVERY_DATE, 'Tanggal pengiriman harus terisi').notEmpty();
    req.assert(DELIVERY_CONST.FIELDS.PHONE_NUMBER, 'Kolom nomor handphone harus terisi').notEmpty();
    req.assert(DELIVERY_CONST.FIELDS.EXPEDITION_NO, 'Kolom nomor expedisi harus terisi').notEmpty();
    req.assert(DELIVERY_CONST.FIELDS.ID, 'ID Pengiriman tidak disertakan').notEmpty();
    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(errors);
    }
    var where = {};
    where[DELIVERY_CONST.FIELDS.ID] = req.body[DELIVERY_CONST.FIELDS.ID];
    _getDelivery(where)
        .then(function (Delivery) {
            console.log('Updating client data');
            var clientId = Delivery.related('client').get(CLIENT_CONST.FIELDS.ID);
            var whereClient = {};
            whereClient[CLIENT_CONST.FIELDS.ID] = clientId;
            _updateClient(req, whereClient, true)
                .then(function (client) {
                    console.log("client has been updated with id " +whereClient[CLIENT_CONST.FIELDS.ID]);
                    console.log("updating delivery data ");
                    _updateDelivery(req, where).then(function (Delivery) {
                        console.log('delivery succesfully updated with id' +Delivery.id);
                        res.send({
                            msg: 'Delivery has been updated successfully with id ' +where[DELIVERY_CONST.FIELDS.ID],
                            data : Delivery
                        });
                    })
                })
                .catch(function (err) {
                    console.log(err);
                    return res.status(400).send(err);
                })
        })
        .catch(function (err) {
            console.log(err);
            return res.status(400).send(err);
        })
}
function newDeliveryPost(req, res) {
    console.log('received a new delivery req with name ' + req.body[CLIENT_CONST.FIELDS.NAME]);
    req.assert(CLIENT_CONST.FIELDS.NAME, 'Kolom nama harus terisi').notEmpty();
    req.assert(CLIENT_CONST.FIELDS.PASPORT_NUMBER, 'Kolom nomor paspor harus terisi').notEmpty();
    req.assert(DELIVERY_CONST.FIELDS.DELIVERY_DATE, 'Tanggal pengiriman harus terisi').notEmpty();
    req.assert(DELIVERY_CONST.FIELDS.PHONE_NUMBER, 'Kolom nomor handphone harus terisi').notEmpty();
    req.assert(DELIVERY_CONST.FIELDS.EXPEDITION_NO, 'Kolom nomor expedisi harus terisi').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(errors);
    }
    _getClientByPasportNumber(req)
        .then(function (client) {
            if (client == null) {
                console.log('client is not exist in system so we will create a new');
                _crateNewClient(req)
                    .then(function (newClient) {
                        console.log('new client has been created with id ' + newClient.id);
                        _createNewDelivery(req, newClient.id)
                            .then(function (delivery) {
                                console.log('new delivery data has been created with id '+ delivery.id);
                                res.send({ msg: 'Delivery has been created with id' +delivery.id });
                            })
                            .catch(function (err) {
                                console.log(err);
                                return res.status(400).send(err);
                            })
                    })
                    .catch(function (err) {
                        return res.status(400).send(err);
                    })
            }else {
                console.log('client is exist performing update client data');
                var where = {};
                where[CLIENT_CONST.FIELDS.PASPORT_NUMBER] = req.body[CLIENT_CONST.FIELDS.PASPORT_NUMBER];
                _updateClient(req, where)
                    .then(function (newClient) {
                        console.log('client has been updated with id ' + newClient.id);
                        _createNewDelivery(req, newClient.id)
                            .then(function (delivery) {
                                console.log('new delivery data has been created with id '+ delivery.id);
                                res.send({ msg: 'Delivery has been created with id' +delivery.id });
                            })
                            .catch(function (err) {
                                console.log(err);
                                return res.status(400).send(err);
                            })
                    })
                    .catch(function (err) {
                        console.log('failed to update client data');
                        return res.status(400).send(err);
                    })
            }
        })
        .catch(function (err) {
            return res.status(400).send(err);
        });



}
function _getDelivery(where,orderBy) {
    return Delivery.getDelivery(where, orderBy);
}
function getAllDeliveries(req,res) {
    var fetchParams = {
        require : false,
        withRelated : ['client','expedition']
    };
    Deliveries.forge().fetch(fetchParams).then(function(Deliveries) {
        res.json(Deliveries.toJSON());
    });
}
function _createNewDelivery(req,clientID) {
    var newDelivery = {};
    newDelivery[DELIVERY_CONST.FIELDS.PHONE_NUMBER] = req.body[DELIVERY_CONST.FIELDS.PHONE_NUMBER];
    newDelivery[DELIVERY_CONST.FIELDS.ADDRESS] = req.body[DELIVERY_CONST.FIELDS.ADDRESS];
    newDelivery[DELIVERY_CONST.FIELDS.EXPEDITION_NO] = req.body[DELIVERY_CONST.FIELDS.EXPEDITION_NO];
    newDelivery[DELIVERY_CONST.FIELDS.DELIVERY_DATE] = req.body[DELIVERY_CONST.FIELDS.DELIVERY_DATE];
    newDelivery[DELIVERY_CONST.FIELDS.CLIENT_ID] = clientID;
    newDelivery[DELIVERY_CONST.FIELDS.STATUS] = 0;
    newDelivery[DELIVERY_CONST.FIELDS.INPUT_BY] = req.body.user.id;
    return Delivery.createOne(newDelivery);
}
function _crateNewClient(req,update) {
    var newClient = {};
    newClient[CLIENT_CONST.FIELDS.NAME] = req.body[CLIENT_CONST.FIELDS.NAME];
    newClient[CLIENT_CONST.FIELDS.PASPORT_NUMBER] = req.body[CLIENT_CONST.FIELDS.PASPORT_NUMBER];
    return Client.createOne(newClient);
}
function _updateClient(req, where, paspor) {
    var newClient = {};
    newClient[CLIENT_CONST.FIELDS.NAME] = req.body[CLIENT_CONST.FIELDS.NAME];
    if (paspor) newClient[CLIENT_CONST.FIELDS.PASPORT_NUMBER] = req.body[CLIENT_CONST.FIELDS.PASPORT_NUMBER];
    return Client.updateOne(newClient, where);
}
function _updateDelivery(req, where, data) {
    var newDelivery = {};
    if (!data){
        newDelivery[DELIVERY_CONST.FIELDS.PHONE_NUMBER] = req.body[DELIVERY_CONST.FIELDS.PHONE_NUMBER];
        newDelivery[DELIVERY_CONST.FIELDS.STATUS] = req.body[DELIVERY_CONST.FIELDS.STATUS];
        newDelivery[DELIVERY_CONST.FIELDS.DELIVERY_DATE] = req.body[DELIVERY_CONST.FIELDS.DELIVERY_DATE];
        newDelivery[DELIVERY_CONST.FIELDS.EXPEDITION_NO] = req.body[DELIVERY_CONST.FIELDS.EXPEDITION_NO];
        newDelivery[DELIVERY_CONST.FIELDS.ADDRESS] = req.body[DELIVERY_CONST.FIELDS.ADDRESS];
        newDelivery[DELIVERY_CONST.FIELDS.INPUT_BY] = req.body[DELIVERY_CONST.FIELDS.INPUT_BY];
        newDelivery[DELIVERY_CONST.FIELDS.RECEIVED_DATE] = req.body[DELIVERY_CONST.FIELDS.RECEIVED_DATE];
    }else {
        newDelivery = data;
    }
    return Delivery.updateOne(newDelivery, where);
}
function _getClientByPasportNumber(req) {
    return Client.byPassportNumber(req.body[CLIENT_CONST.FIELDS.PASPORT_NUMBER])
}
function _removeDelivery(where) {
    return Delivery.deleteOne(where);
}
function _getOneClient(where) {
    return Client.getClient(where);
}