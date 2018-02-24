const web3 = require('./web3.js');
var Chess = require('chess.js').Chess;

exports.getGameCondition = async function (contract) {
    var moves = await web3.getMoves(contract);
    var chess = new Chess();

    for (var m = 0; m < moves.length; m++) {
        chess.move(moves[m], { sloppy: true });
    }

    if (chess.in_checkmate()) {
        return 'checkmate';
    }

    if (chess.in_draw()) {
        return 'draw';
    }

    return 'continue';
};