var Service = function () {
    var contracts = [
        '0xd9801934089743a17ba06180062b40ab15b596fb'
    ];

    this.getGames = function () {
        return contracts;
    }

    this.getGameMoves = function (gameContract) {
        var instance = contract.prototype.at(gameContract);
        var moves = [];
        
        instance.getHalfMovesCount.call((count) => {
            for (var i = 1; i < count; i++) {
                instance.getHalfMove.call(i, (move) => {
                    moves.push(move);
                });
            }
        })

        return moves;
    }
};

var service = new Service();