var Engine = function (address) {
    var self = this;
    var chess = new Chess();
    this.board;

    var onDrop = function (source, target, piece, newPos, oldPos, orientation) {
        var sloppyNotation = source + '-' + target;

        if (!makeMove(sloppyNotation)) {
            return 'snapback';
        }

        service.makeMove(address, sloppyNotation);
    };

    var onDragStart = function (source, piece, position, orientation) {
        if (chess.game_over() ||
            (chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (chess.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }
    };

    this.config = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
    }

    this.setGame = function (moves) {
        board = ChessBoard('board', self.config);

        if (moves) {
            for (var m = 0; m < moves.length; m++) {
                makeMove(moves[m]);
                board.move(moves[m]);
            }

            board.orientation(chess.turn() === 'w' ? 'white' : 'black');
        }
    }

    function makeMove(move) {
        var moveValid = chess.move(move, { sloppy: true });

        return moveValid;
    }
};