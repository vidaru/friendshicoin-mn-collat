const config = require('../configuration')
const RPC = require('./rpc')

class CoinService {
  constructor({ url, port, user, password }) {
    this.client = new RPC({ url, port, user, password })
  }

  async getBalance() {
    return this.client.request('getbalance').then(r => r.result)
  }

  async rescan() {
    return this.client.request('scanforalltxns').then(r => r.result)
  }

  async sendToMany(ledger) {
    if (Object.keys(ledger).length == 0) { return }
    return this.client.request('sendmany', ["", ledger]).then(r => r.result)
  }

  async getNewAddress() {
    return this.client.request('getnewaddress').then(r => r.result)
  }

  async utxos() {
    return await this.client.request('listunspent').then(r => r.result)
  }

  async createRawTransaction(inputs, outputs) {
    return await this.client.request(
      'createrawtransaction', [inputs, outputs]
    ).then(r => r.result)
  }

  async signRawTransaction(tx) {
    return await this.client.request(
      'signrawtransaction', [tx]
    ).then(r => r.result.hex)
  }

  async sendRawTransaction(tx) {
    return await this.client.request(
      'sendrawtransaction', [tx]
    ).then(r => r.result)
  }

  /*
  async createRaw(ledger, total) {
    if (Object.keys(ledger).length == 0) { return }
    const utxos = await this.client.request('listunspent').then(r => r.result)
    var filled = 0
    const inputs = utxos.filter((utxo) => {
      if (filled <= (total + 1000)) {
        filled += (utxo.amount * 1e8)
        return true
      }
      return false
    }).map((utxo) => {
      return {"txid": utxo.txid, "vout": utxo.vout }
    })

    const change = await this.client.request(
      'getnewaddress'
    ).then(r => r.result)

    const changeTotal = (filled - (total + 1000))
    ledger[change] = changeTotal * 1e-8

    const rawtx = await this.client.request(
      'createrawtransaction', [inputs, ledger]
    ).then(r => r.result)

    const signedTx = await this.client.request(
      'signrawtransaction', [rawtx]
    ).then(r => r.result)

    return this.client.request(
      'sendrawtransaction', [signedTx.hex]
    ).then(r => r.result)
  }*/
}

module.exports = exports = CoinService
