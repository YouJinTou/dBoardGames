var ClassicChess = function () {
    function createGame(account, wager, durationPerMove) {
        var game = contract.getPrototype().new(
            durationPerMove,
            {
                data: '0x' + contract.getBytecode(),
                from: account,
                value: wager,
                gas: 1777777
            }, function (error, result) {
                console.log(error);
                console.log(result);
            });
    }

    return {
        createGame: createGame
    }
};

var classicChess = new ClassicChess();