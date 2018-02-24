const web3 = require('./web3.js');
var Chess = require('chess.js').Chess;

exports.conditionValid = async function (contract, condition) {
    var moves = await web3.getMoves(contract);
    var chess = new Chess();
    var atLeastOneValid = false;

    for (var m = 0; m < moves.length; m++) {
        if (!moves[m]) {
            continue;
        }

        var move = chess.move(moves[m], { sloppy: true });

        if (!move) {
            return false;
        }

        atLeastOneValid = true;
    }
    
    return atLeastOneValid;
};