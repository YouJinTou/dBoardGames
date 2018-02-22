var ClassicChess = function () {
    var contract;
    var bytecode;

    setContract();

    function createGame(account, wager, durationPerMove) {
        var game = contract.new(
            durationPerMove,
            {
                data: '0x' + bytecode,
                from: account,
                value: wager,
                gas: 1777777
            }, function (error, result) {
                console.log(error);
                console.log(result);
            });
    }

    async function setContract() {
        var contractAbi = await fetch('./ClassicChess.abi');
        var contractBin = await fetch('./ClassicChess.bin');
        bytecode = await contractBin.text();
        contract = web3.eth.contract(JSON.parse(await contractAbi.text()));
    }

    return {
        createGame: createGame
    }
};

var classicChess = new ClassicChess();