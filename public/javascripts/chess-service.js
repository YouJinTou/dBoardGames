var Service = function () {
    var self = this;

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
                    bootbox.alert(error);
                }

                if (result.address) {
                    self.addGame(result.address);
                }
            }));
    }

    this.joinGame = async function (account, gameContract) {
        var instance = getInstance(gameContract);
        var prizePool = await promisify(cb => instance.getPrizePool(cb));

        await promisify(cb => instance.joinGame({
            from: account,
            value: prizePool,
            gas: 3000000
        }, cb));
    }

    this.resignGame = async function (gameContract) {
        var instance = getInstance(gameContract);

        await promisify(cb => instance.resignGame({ gas: 100000 }, cb));
    }

    this.tryClaimWinOnTime = async function (gameContract) {
        var instance = getInstance(gameContract);

        await promisify(cb => instance.tryClaimWinOnTime({ gas: 100000 }, cb));
    }

    this.getGames = async function () {
        var gameContracts = [];

        await $.when($.get('/contracts', (contracts) => {
            gameContracts = contracts;
        }));

        return gameContracts;
    }

    this.getGame = async function (address) {
        if (!address) {
            return null;
        }

        var instance = getInstance(address);

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
            console.log('Could not fetch game ' + address);

            return null;
        }
    }

    this.addGame = async function (gameContract) {
        await $.when($.ajax({
            type: 'POST',
            url: '/contracts',
            contentType: 'application/json',
            data: JSON.stringify({
                contract: gameContract
            })
        }).done(() => {
            bootbox.alert('Successfully added game.');
        }).fail((asd) => {
            bootbox.alert('Could not add game.');
        }));
    }

    this.getGameMoves = async function (gameContract) {
        var instance = getInstance(gameContract);
        var moves = [];
        var halfMovesCount = await promisify(cb => instance.getHalfMovesCount(cb));

        for (var i = 1; i < halfMovesCount.c; i++) {
            moves.push(await promisify(cb => instance.getHalfMove(i, cb)));
        }

        return moves;
    }

    this.getPlayerToMove = async function (gameContract) {
        var instance = getInstance(gameContract);

        return await promisify(cb => instance.playerToMove(cb));
    }

    this.makeMove = async function (gameContract, move) {
        var instance = getInstance(gameContract);

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

                bootbox.alert('Move transaction pending...');
            }
        }));
    }

    function getInstance(address) {
        return contract.prototype.at(address);
    }
};

var service = new Service();