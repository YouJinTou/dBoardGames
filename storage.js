var mongo = require('mongodb').MongoClient;
const endpoint = process.env.MONGODB_URI || 'mongodb://localhost:27017/dBoardGames';
const dbName = process.env.MONGODB_URI ? 'heroku_0hf5z321' : 'dBoardGames';

module.exports = {
    getContracts: (cb) => {
        mongo.connect(endpoint, (err, database) => {
            if (err) {
                throw err;
            }

            var db = database.db(dbName);
            var contracts = new Set();
            var cursor = db.collection('contracts').find();

            cursor.forEach((doc, err) => {
                if (doc) {
                    contracts.add(doc.contract);
                }
            }, () => {
                database.close();
                
                cb(contracts);
            });
        });
    },
    addContract: (contract, cb) => {
        mongo.connect(endpoint, (err, database) => {
            if (err) {
                throw err;
            }

            var db = database.db(dbName)
            var contractObj = {
                contract: contract
            };

            console.log(contractObj);

            db.collection('contracts').insertOne(contractObj, (err, result) => {
                console.log(result);

                cb(result);

                database.close();
            });
        });
    }
}