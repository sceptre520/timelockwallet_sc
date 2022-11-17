require('dotenv').config()

const utils = require('./utils');

const Timelockwallet = artifacts.require("Timelockwallet");
const TestToken = artifacts.require("TestToken");

contract("Timelockwallet", (accounts) => {
  let [alice, bob] = accounts;
  let contractInstance;

  beforeEach(async () => {
    tokenInstance = await TestToken.new("Test1", "TT1");
    contractInstance = await Timelockwallet.new("TLW", "TLW");
    await contractInstance.addToken(tokenInstance.address, {from: alice});
  });

  it("Deposit & withdraw", async () => {
    await contractInstance.setManager(alice, true, {from: alice});
    await contractInstance.setManager(bob, true, {from: alice});
    await tokenInstance.approve(contractInstance.address, "999999999999999999999999999999", {from: alice});
    await tokenInstance.approve(contractInstance.address, "999999999999999999999999999999", {from: bob});

    var lpBalance = await contractInstance.balanceOf(alice);
    expect(lpBalance.toString()).to.equal("0");
    
    await contractInstance.deposit(tokenInstance.address, "2000000000000000000000", {from: alice});

    lpBalance = await contractInstance.balanceOf(alice);
    expect(lpBalance.toString()).to.equal("2000000000000000000000");

    await contractInstance.withdraw(tokenInstance.address, "10000000000000000000", { from: alice })
    try {
      await contractInstance.withdraw(tokenInstance.address, "100000000000000000000", { from: alice })
      assert(false, 'did not throw error as expected')
    } catch (error) {
      utils.ensureException(error, 'TIMELOCKWALLET: Withdraw limitation exceeds')
    }
    await contractInstance.withdraw(tokenInstance.address, "90000000000000000000", { from: alice })

    var withdrawList = await contractInstance.getWithdrawLength(alice);
    expect(withdrawList.toString()).to.equal("2");

    var withdrawInfo = await contractInstance.getWithdrawInfo(alice, "1");
    expect(withdrawInfo.amount).to.equal("10000000000000000000");
    withdrawInfo = await contractInstance.getWithdrawInfo(alice, "2");
    expect(withdrawInfo.amount).to.equal("90000000000000000000");

    var recentInfo = await contractInstance.getRecentWithdrawLength(alice);
    expect(recentInfo.toString()).to.equal("2");
  })

  it("Control manager", async () => {
    var allManager = await contractInstance.getAllManager({from: alice});
    expect(allManager.length).to.equal(0);

    await contractInstance.setManager(alice, true, {from: alice});
    await contractInstance.setManager(bob, true, {from: alice});

    var allManager = await contractInstance.getAllManager({from: alice});
    expect(allManager.length).to.equal(2);
    expect(allManager[0]).to.equal(alice);
    expect(allManager[1]).to.equal(bob);

    await contractInstance.setManager(alice, false, {from: alice});

    var allManager = await contractInstance.getAllManager({from: alice});
    expect(allManager.length).to.equal(1);
    expect(allManager[0]).to.equal(bob);
  })
})
