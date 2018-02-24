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
        var account = '0xCa411557A6E7f84269FAc1e1d397671aA18A2364';
        var key = new Buffer('2ce5e697cc8979a3e5032a995e0077c30be3a777213020f3ea1db6681a6f720c', 'hex')
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