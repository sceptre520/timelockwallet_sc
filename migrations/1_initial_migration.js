const Timelockwallet = artifacts.require("Timelockwallet");

module.exports = function (deployer) {
  deployer.deploy(Timelockwallet, "TokenLockWallet", "TLW");
};
