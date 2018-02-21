var ClassicChess = artifacts.require("./ClassicChess.sol");

module.exports = function(deployer) {
  deployer.deploy(ClassicChess);
};
