var fs = require('fs');
var Web3 = require('web3');
var web3 = new Web3(
    new Web3.providers.HttpProvider(
        // 'https://ropsten.infura.io/Mjg9P5FAlAk5TUZqjizC'
        'http://localhost:8545'
    ));

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
        var halfMovesCount = await promisify(cb => instance.methods.getHalfMovesCount().call(cb));

        for (var i = 1; i <= halfMovesCount; i++) {
            moves.push(await promisify(cb => instance.methods.getHalfMove(i).call(cb)));
        }
        
        return moves;
    }
}

function getContractInstance(contractAddress) {
    var contractAbi = fs.readFileSync('./public/contracts/ClassicChess_sol_ClassicChess.abi');
    var contract = new web3.eth.Contract(JSON.parse(contractAbi), contractAddress);

    return contract;
}