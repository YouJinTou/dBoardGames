var Engine = function (address) {
    var self = this;
    var chess = new Chess();
    this.board;

    var onDrop = function (source, target, piece, newPos, oldPos, orientation) {
        var sloppyNotation = source + '-' + target;

        if (!makeMove(sloppyNotation)) {
            return 'snapback';
        }

        service.makeMove(address, sloppyNotation, getEndGameCondition());
    };

    function getEndGameCondition() {
        if (chess.in_checkmate()) {
            return 'checkmate';
        }

        if (chess.in_draw()) {
            return 'draw';
        }

        return 'checkmate';
    }

    var onDragStart = function (source, piece, position, orientation) {
        console.log(chess.game_over())
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
        onDrop: onDrop
    }

    this.setGame = function (moves) {
        board = ChessBoard('board', self.config);

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