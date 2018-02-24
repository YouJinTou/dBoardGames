var fs = require('fs');
var Web3 = require('web3');
var web3 = new Web3(
    new Web3.providers.HttpProvider(
        // 'https://ropsten.infura.io/Mjg9P5FAlAk5TUZqjizC'
        'http://localhost:8545'
    ));
const Tx = require('ethereumjs-tx');
const promisify = (inner) =>
    new Promise((resolve, reject) =>
        inner((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    );

module.exports = {
    getMoves: async function (contractAddress) {
        var instance = getContractInstance(contractAddress);
        var moves = [];
        var halfMovesCount = await promisify(cb => instance.getHalfMovesCount(cb));

        for (var i = 1; i <= halfMovesCount; i++) {
            moves.push(await promisify(cb => instance.getHalfMove(i, cb)));
        }

        return moves;
    },
    enforceGameEnd: async function (contractAddress, condition) {
        var account = '0xF2Db66669b06b32fc7bbB7C17A679e8CdB6d80Cd';
        var key = new Buffer('8c39ca708bf4a678449d070e9e7b12853c4f7eb97c764c63ee2fb0e481841a69', 'hex')
        var abi = fs.readFileSync('./public/contracts/ClassicChess_sol_ClassicChess.abi');
        var bytecode = fs.readFileSync('./public/contracts/ClassicChess_sol_ClassicChess.abi');
        var contract = web3.eth.contract(abi)
        var gasPrice = web3.eth.gasPrice;
        var gasPriceHex = web3.toHex(gasPrice);
        var gasLimitHex = web3.toHex(3000000);
        var instance = getContractInstance(contractAddress);
        var data = condition === 'checkmate' ?
            instance.enforceCheckmate.getData() :
            instance.enforceDraw.getData();
        var transactionData = {
            gasPrice: gasPriceHex,
            gas: gasLimitHex,
            data: data,
            from: account,
            to: contractAddress,
            nonce: web3.eth.getTransactionCount(account)
        };
        var tx = new Tx(transactionData);

        tx.sign(key);

        var serializedTx = tx.serialize();

        web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
            if (err) {
                console.log(err);
            } else {
                console.log(hash);
            }
        });
    }
}

function getContractInstance(contractAddress) {
    var contractAbi = fs.readFileSync('./public/contracts/ClassicChess_sol_ClassicChess.abi');
    var contract = web3.eth.contract(JSON.parse(contractAbi));

    return contract.at(contractAddress);
}