var Service = function () {
    var self = this;

    this.getInstance = function (address) {
        return contract.prototype.at(address);
    }

    this.createGame = async function (account, wager, durationPerMove) {
        await promisify(cb => contract.prototype.new(
            durationPerMove,
            {
                data: '0x' + contract.bytecode,
                from: account,
                value: wager,
                gas: 1777777
            }, function (error, result) {
                if (error) {
                    alert(error);
                }

                if (result.address) {
                    service.addGame(result.address);
                }
            }));
    }

    this.joinGame = async function (account, gameContract) {
        var instance = service.getInstance(gameContract);
        var prizePool = await promisify(cb => instance.getPrizePool(cb));
        
        await promisify(cb => instance.joinGame({
            from: account,
            value: prizePool,
            gas: 3000000
        }, cb));
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

    this.makeMove = async function (gameContract, move) {
        var instance = self.getInstance(gameContract);

        await promisify(cb => instance.makeMove(move, { gas: 100000 }, (err, result) => {
            if (!err) {
                $.ajax({
                    type: 'POST',
                    url: '/enforce',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        contract: gameContract
                    })
                  });
            }
        }));
    }
};

var service = new Service();