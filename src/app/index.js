const CoinService = require('../coinservice')
const fs = require('fs-extra')
const os = require('os')
const expandTilde = require('expand-tilde')

exports.start = async function() {
  const config = await this.configObject()
  const user = config['rpcuser']
  const password = config['rpcpassword']
  const port = config['rpcport'] || '58009'

  const collat = 14466

  const service = new CoinService({ user, password, port, url: '127.0.0.1' })
  console.log('Getting UTXOs')
  const utxos = await service.utxos().then(r => r.filter((utxo) => {
    return utxo.amount !== collat
  }))

  const maxAmount = utxos.reduce((amount, utxo) => {
    return amount + utxo.amount
  }, 0)

  if (maxAmount < collat) {
    throw new Error(`Not enough to create a new MN, need: 14466   have: ${maxAmount}`)
  }

  const address = await service.getNewAddress()
  const change = await service.getNewAddress()

  const fee = 0.0002

  const feeCoin = fee * 1e8
  const collatCoin = collat * 1e8
  var totalCoin = 0

  const inputs = utxos.filter((utxo) => {
    if (totalCoin <= collatCoin + feeCoin) {
      totalCoin += Math.floor(utxo.amount * 1e8)
      return true
    } else {
      return false
    }
  }).map((input) => ({ "txid": input.txid, "vout": input.vout }))

  const outputs = {}
  outputs[address] = collat
  outputs[change] = (totalCoin - feeCoin - collatCoin) / 1e8

  const raw = await service.createRawTransaction(inputs, outputs)
  const signed = await service.signRawTransaction(raw)
  const result = await service.sendRawTransaction(signed)

  console.log(`MN Address: ${address}`)
  console.log(`TX id: ${result}`)
}

exports.configPath = function() {
  const platform = os.platform()
  let path = ''
  switch (platform) {
    case 'darwin':
      path = '~/Library/Application\ Support/FriendshipCoin/'
      break
    case 'win32':
      path = '%APPDATA%/Roaming/FriendshipCoin/'
      break;
    default: path = '~/.friendshipcoin/'
      break
  }

  return `${path}friendshipcoin.conf`
}

exports.configObject = async function() {
  const path = expandTilde(this.configPath())
  const file = await fs.readFile(path).then(r => r.toString('ascii'))
  const lines = file.split('\n').filter(
    (line) => line[0] !== '#' && line.length > 0
  )
  const config = lines.reduce((obj, line) => {
    const comps = line.split('=')
    obj[comps[0]] = comps[1]
    return obj
  }, {})

  return config
}
