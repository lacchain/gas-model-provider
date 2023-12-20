import { AccessList, Signature, Transaction, TransactionLike } from 'ethers';



export class LacchainTransaction implements TransactionLike {

  constructor(private _aOriginalTx: Transaction, private _aHashTx: string) {}

  get hash(): null | string {
    return this._aHashTx;
  }

  get type(): null | number { return this._aOriginalTx.type; }
  get typeName(): null | string { return this._aOriginalTx.typeName; }
  get to(): null | string { return this._aOriginalTx.to; }
  get nonce(): number { return this._aOriginalTx.nonce; }
  get gasLimit(): bigint { return this._aOriginalTx.gasLimit; }
  get gasPrice(): null | bigint { return this._aOriginalTx.gasPrice; }
  get maxPriorityFeePerGas(): null | bigint { return this._aOriginalTx.maxPriorityFeePerGas; }
  get maxFeePerGas(): null | bigint { return this._aOriginalTx.maxFeePerGas; }
  get data(): string { return this._aOriginalTx.data; }
  get value(): bigint { return this._aOriginalTx.value; }
  get chainId(): bigint { return this._aOriginalTx.chainId; }
  get signature(): null | Signature { return this._aOriginalTx.signature || null; }
  get accessList(): null | AccessList { return this._aOriginalTx.accessList }
  get unsignedHash(): string { return this._aOriginalTx.unsignedHash; }
  get from(): null | string { return this._aOriginalTx.from; }
  get fromPublicKey(): null | string { return this._aOriginalTx.fromPublicKey; }
  get serialized(): string { return this._aOriginalTx.serialized; }
  get unsignedSerialized(): string { return this._aOriginalTx.unsignedSerialized; }
}
