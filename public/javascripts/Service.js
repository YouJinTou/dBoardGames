var Service = function () {
    var self = this;
    // var contracts = [
    //     '0xd9801934089743a17ba06180062b40ab15b596fb'
    // ];
    var contracts = [
        '0xfd648a7ac5d1582c54b6701d2150f5717e85528a',
        '0x416db5284bbfde9fccfbfe23c3582e44b97652b5'
    ]

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
            gameStarted: await promisify(cb => instance.getGameStarted(cb)),
            gameEnded: await promisify(cb => instance.getGameEnded(cb)),
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

        for (var i = 1; i <= halfMovesCount.c; i++) {
            moves.push(await promisify(cb => instance.getHalfMove(i, cb)));
        }

        return moves;
    }

    this.addGame = function (gameContract) {
        contracts.push(gameContract);
    }

    this.makeMove = async function (gameContract, move) {
        var instance = self.getInstance(gameContract);

        await promisify(cb => instance.makeMove(move, { gas: 100000 }, cb));
    }
};

var service = new Service();