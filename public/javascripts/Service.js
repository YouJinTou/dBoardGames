var Service = function () {
    var self = this;

    this.getInstance = function (address) {
        return contract.prototype.at(address);
    }

    this.getGames = function () {
        return sessionStorage['game-contracts'].split(',');
    }

    this.getGame = async function (address) {
        var instance = self.getInstance(address);

        try {
            var game = {
                address: address,
                gameStarted: await promisify(cb => instance.getGameStarted(cb)),
                gameEnded: await promisify(cb => instance.getGameEnded(cb)),
                currentMove: parseInt(await promisify(cb => instance.getHalfMovesCount(cb)) / 2) + 1,
                playerToMove: await promisify(cb => instance.playerToMove(cb)),
                durationPerMove: await promisify(cb => instance.getDurationPerMove(cb)),
                fee: await promisify(cb => instance.getFee(cb)),
                prizePool: await promisify(cb => instance.getPrizePool(cb)),
            };

            return game;
        } catch (err) {
            console.log(err);

            return null;
        }
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
        if (sessionStorage['game-contracts']) {
            sessionStorage['game-contracts'] += ',' + gameContract;
        } else {
            sessionStorage['game-contracts'] = gameContract;
        }
    }

    this.makeMove = async function (gameContract, move, endGameCondition) {
        var instance = self.getInstance(gameContract);

        await promisify(cb => instance.makeMove(move, { gas: 100000 }, (err, result) => {
            if (!err) {
                console.log(endGameCondition);
                // $.post('enforce', { condition: endGameCondition, condition: gameContract })
                $.ajax({
                    type: 'POST',
                    url: '/enforce',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        condition: endGameCondition,
                        contract: gameContract
                    }),
                    success: alert('Game over.')
                  });
            }

            // switch (endGameCondition) {
            //     case 'checkmate':
            //         await promisify(cb => instance.enforceCheckmate({ gas: 100000 }, cb));

            //         break;
            //     case 'draw':
            //         await promisify(cb => instance.enforceDraw({ gas: 100000 }, cb));
            //     default:
            //         break;
            // }
        }));
    }
};

var service = new Service();