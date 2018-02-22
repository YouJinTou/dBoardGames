var Contract = function () {
    var contract;
    var bytecode;

    setContract();    

    function getPrototype() {
        return contract;
    }

    function getBytecode() {
        return bytecode;
    }

    async function setContract() {
        var contractAbi = await fetch('./contracts/ClassicChess.abi');
        var contractBin = await fetch('./contracts/ClassicChess.bin');
        bytecode = await contractBin.text();
        contract = web3.eth.contract(JSON.parse(await contractAbi.text()));
    }

    return {
        getPrototype: getPrototype,
        getBytecode: getBytecode
    }
};

var contract = new Contract();