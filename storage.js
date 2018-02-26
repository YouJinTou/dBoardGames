var mongo = require('mongodb').MongoClient;
const endpoint = process.env.MONGODB_URI || 'mongodb://localhost:27017/dBoardGames';

module.exports = {
    getContracts: (cb) => {
        mongo.connect(endpoint, (err, db) => {
            if (err) {
                throw err;
            }

            // var db = database.db('dBoardGames');
            var contracts = new Set();
            var cursor = db.collection('contracts').find();

            cursor.forEach((doc, err) => {
                if (doc) {
                    contracts.add(doc.contract);
                }
            }, () => {
                db.close();
                
                cb(contracts);
            });
        });
    },
    addContract: (contract, cb) => {
        mongo.connect(endpoint, (err, db) => {
            if (err) {
                throw err;
            }

            // var db = database.db('dBoardGames')
            var contractObj = {
                contract: contract
            };

            db.collection('contracts').insertOne(contractObj, (err, result) => {
                cb(result);

                db.close();
            });
        });
    }
}