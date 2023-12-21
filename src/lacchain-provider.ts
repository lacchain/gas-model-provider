import {
  JsonRpcProvider,
  FetchRequest,
  Networkish,
  JsonRpcApiProviderOptions,
  PerformActionRequest,
  TransactionResponse,
  resolveProperties,
  Transaction,
} from 'ethers';

import { LacchainTransaction } from './lacchain-transaction';

export class LacchainProvider extends JsonRpcProvider {
  constructor(
    url: string | FetchRequest,
    network?: Networkish,
    options?: JsonRpcApiProviderOptions,
  ) {
    super(url, network, { batchMaxSize: 1, ...options });
  }

  async _perform(req: PerformActionRequest) {
    const result = await super._perform(req);
    if (req.method === 'getTransactionReceipt' && result) {
      delete result.root;
      result.confirmations = 1;
    }
    return result;
  }

  async broadcastTransaction(signedTx: string): Promise<TransactionResponse> {
    const { blockNumber, hash, network } = await resolveProperties({
      blockNumber: this.getBlockNumber(),
      hash: this._perform({
        method: 'broadcastTransaction',
        signedTransaction: signedTx,
      }),
      network: this.getNetwork(),
    });

    const tx = new LacchainTransaction(Transaction.from(signedTx), hash);

    if (tx.hash !== hash) {
      throw new Error('@TODO: the returned hash did not match');
    }

    return this._wrapTransactionResponse(
      <any>tx,
      network,
    ).replaceableTransaction(blockNumber);
  }
}
