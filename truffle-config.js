
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
        // return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/YOUR_API_KEY")
        const HDWalletProvider = require("@truffle/hdwallet-provider");
        const MNEMONIC = "first west stock bleak govern sell flock crack promote involve venture lunch";
        return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/08744914b5f04c08bff524c959686bbe")
      },
      network_id: 3,
      gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}

// Deploying 'TodoList'
// --------------------
// > transaction hash:    0xbcbb3e5f0caec70a2da3dc3f040c86e2c491f05ac630e0d97e4055281d3bbbaa
// > Blocks: 0            Seconds: 9
// > contract address:    0x0b6D727b2483763Ca8e9E9dd99f8e1A8C6Efc97f
// > block number:        8473330
// > block timestamp:     1597137814
// > account:             0x3a1f54faE1699233B445F865eae18005883A514A
// > balance:             2.98734384
// > gas used:            461572 (0x70b04)
// > gas price:           20 gwei
// > value sent:          0 ETH
// > total cost:          0.00923144 ETH