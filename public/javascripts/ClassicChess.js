var ClassicChess = function () {
    this.createGame = function (account, wager, durationPerMove) {
        var game = contract.prototype.new(
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
            });
    }

    this.joinGame = function (account, gameContract) {
        var instance = service.getInstance(gameContract);

        instance.getPrizePool.call((error, prizePool) => {
            instance.joinGame(
                {
                    from: account,
                    value: prizePool,
                    gas: 3000000
                }, (error, result) => {
                    if (error) {
                        alert(error);
                    }
                });
        });
    }
};

var classicChess = new ClassicChess();