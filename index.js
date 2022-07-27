const {ethers, Contract} = require('ethers')
const player = require('play-sound')(opts = {})

// Our provider
const rpcURL = 'https://cloudflare-eth.com/'
const provider = new ethers.providers.JsonRpcProvider(rpcURL)

// Here contract address(USDT) and a generalised ABI(ERC20) 
const CONTRACT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
const CONTRACT_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]

const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)

const TRANSFER_THRESHOLD = 100000000000 //100,000 USDT (USDT uses 6 decimal points).

const playSound = () => {
    player.play('ding.mp3', function(err){
      if (err) throw err
    })
  }

const main = async() => {
    // Returns the name of the token.
    const name = await contract.name()
    console.log('Whale tracker started!\nListening for large transfers on:',name)

    // Note: not all ERC-20 tokens index `amount` use query filter from Ethers.js read the docs.
    contract.on('Transfer', (from, to, amount, data) => {
        
        if(amount.toNumber() >= TRANSFER_THRESHOLD){
            console.log(`NEW WHALE TRANSFER FOUND (${name}): https://etherscan.io/tx/${data.transactionHash}\nFROM: https://etherscan.io/address/${from}`)
            playSound()
        }
    })
}

main()
