var ClassicChess = function () {
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
};

var classicChess = new ClassicChess();