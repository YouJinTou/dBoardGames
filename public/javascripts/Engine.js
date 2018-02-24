var Engine = function (address) {
    var self = this;
    var chess = new Chess();
    var onDrop = function (source, target, piece, newPos, oldPos, orientation) {
        var sloppyNotation = source + '-' + target;

        if (!makeMove(sloppyNotation)) {
            return 'snapback';
        }

        service.makeMove(address, sloppyNotation);
    };

    this.config = {
        draggable: true,
        position: 'start',
        onDrop: onDrop
    }

    this.setGame = function (moves) {
        var board = ChessBoard('board', self.config);

        for (var m = 0; m < moves.length; m++) {
            makeMove(moves[m]);
            board.move(moves[m]);
        }
    }

    function makeMove(move) {
        var moveValid = chess.move(move, { sloppy: true });

        return moveValid;
    }
};