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
                console.log(error);
                console.log(result);
            });
    }
};

var classicChess = new ClassicChess();