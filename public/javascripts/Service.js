var Service = function () {
    var self = this;
    var contracts = [
        '0xd9801934089743a17ba06180062b40ab15b596fb'
    ];

    this.getInstance = function (address) {
        return contract.prototype.at(address);
    }

    this.getGames = function () {
        return contracts;
    }

    this.getGame = async function (address) {
        var instance = self.getInstance(address);
        var game = {
            currentMove: parseInt(await promisify(cb => instance.getHalfMovesCount(cb)) / 2),
            playerToMove: await promisify(cb => instance.playerToMove(cb)),
            durationPerMove: await promisify(cb => instance.getDurationPerMove(cb)),
            fee: await promisify(cb => instance.getFee(cb)),
            prizePool: await promisify(cb => instance.getPrizePool(cb)),
        };

        return game;
    }

    this.getGameMoves = function (gameContract) {
        var instance = self.getInstance(gameContract);
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

    this.addGame = function (gameContract) {
        contracts.push(gameContract);
    }
};

var service = new Service();