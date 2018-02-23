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
            address: address,
            currentMove: parseInt(await promisify(cb => instance.getHalfMovesCount(cb)) / 2),
            playerToMove: await promisify(cb => instance.playerToMove(cb)),
            durationPerMove: await promisify(cb => instance.getDurationPerMove(cb)),
            fee: await promisify(cb => instance.getFee(cb)),
            prizePool: await promisify(cb => instance.getPrizePool(cb)),
        };

        return game;
    }

    this.getGameMoves = async function (gameContract) {
        var instance = self.getInstance(gameContract);
        var moves = [];
        var halfMovesCount = await promisify(cb => instance.getHalfMovesCount(cb));

        for (var i = 0; i < halfMovesCount.s; i++) {
            moves.push(await promisify(cb => instance.getHalfMove(i, cb)));
        }   

        return moves;
    }

    this.addGame = function (gameContract) {
        contracts.push(gameContract);
    }
};

var service = new Service();