const Web3 = require('web3')

const web3 = new Web3()

function asciiToHex(value) {
  return web3.utils.fromAscii(value)
}

function ensureException(error, message) {
  assert(error.toString().includes(message), `Incorrect error message. Expected ${message}. Got ${error.toString()}`)
}

function getUserIDs(count = 50) {
  return [...Array(count)].map(() => asciiToHex(Math.random().toString(27).substring(2, 36)))
}

function getRewardsArray(count = 50) {
  return [...Array(count)].map(() => Math.floor(Math.random() * 100) + 1)
}

const PREFIX = "VM Exception while processing transaction: "

module.exports = {
  asciiToHex,
  zeroAddress: '0x0000000000000000000000000000000000000000',
  mockTxHash: '0xa766e38b186f4c22e4862995b50049038076729b04a2e2fd4bca9e63a19ba686',
  ensureException,
  getUserIDs,
  getRewardsArray
}
