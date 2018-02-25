var Contract = function () {
    var self = this;
    this.prototype;
    this.bytecode;

    setContract();

    async function setContract() {
        var contractAbi = await fetch('./contracts/ClassicChess_sol_ClassicChess.abi');
        var contractBin = await fetch('./contracts/ClassicChess_sol_ClassicChess.bin');
        self.bytecode = await contractBin.text();
        self.prototype = web3.eth.contract(JSON.parse(await contractAbi.text()));
    }
};

var contract = new Contract();