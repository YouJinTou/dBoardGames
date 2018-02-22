var Service = function () {
    var contracts = [
        '0xa13e2f1906854bc8c6695ada6c2d13154a0889f5'
    ];

    function getGames() {
        var games = [];

        contracts.forEach(function (c) {
            games.push(getGameMoves(c));
        });

        return games;
    }

    function getGameMoves(gameContract) {
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

    return {
        getGames: getGames
    }
};

var service = new Service();