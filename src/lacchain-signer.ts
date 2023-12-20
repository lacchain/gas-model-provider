import {
  Provider,
  SigningKey,
  Wallet,
  resolveProperties,
  resolveAddress,
  assertArgument,
  getAddress,
  Transaction,
  TransactionLike,
  TransactionRequest
} from 'ethers';

import { LacchainTransactionRequest } from './lacchain-transaction-request';


export class LacchainSigner extends Wallet {

  constructor(
    privateKey: string | SigningKey,
    provider: Provider,
    private _aNodeAddress: string,
    private _aExpirationTime: number,
  ) {
    super(privateKey, provider);
  }

  async signTransaction(transactionRequest: TransactionRequest): Promise<string> {
    // Replace any Addressable or ENS name with an address
    const { to, from } = await resolveProperties({
      to: transactionRequest.to ? resolveAddress(transactionRequest.to, this.provider) : undefined,
      from: transactionRequest.from ? resolveAddress(transactionRequest.from, this.provider) : undefined,
    });

    if (to != null) {
      transactionRequest.to = to;
    }

    if (from != null) {
      transactionRequest.from = from;
    }

    if (transactionRequest.from != null) {
      assertArgument(
        getAddress(<string>transactionRequest.from) === this.address,
        'transaction from address mismatch',
        'tx.from',
        transactionRequest.from,
      );
      delete transactionRequest.from;
    }

    const btx = Transaction.from(
      <TransactionLike<string>>(
        new LacchainTransactionRequest(transactionRequest, this._aNodeAddress, this._aExpirationTime)
      ),
    );

    btx.signature = this.signingKey.sign(btx.unsignedHash);

    return btx.serialized;
  }
}
