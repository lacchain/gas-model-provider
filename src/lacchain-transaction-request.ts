import { AbiCoder, AccessListish, AddressLike, BigNumberish, BlockTag, TransactionRequest } 
from 'ethers';



export class LacchainTransactionRequest implements TransactionRequest {

  constructor(
    private _aOriginalTransactionRequest: TransactionRequest,
    private _aNodeAddress: string,
    private _aExpirationTime: number
  ) {}

  get data(): any | string {
    return this._aOriginalTransactionRequest.data + AbiCoder.defaultAbiCoder().encode(
      ["address", "uint256"],
      [this._aNodeAddress, this._aExpirationTime]
    ).substring(2);;
  }

  get chainId(): any | BigNumberish { return 0; }

  get type(): any | number { return this._aOriginalTransactionRequest.type; }
  get to(): any | AddressLike { return this._aOriginalTransactionRequest.to; }
  get from(): any | AddressLike { return this._aOriginalTransactionRequest.from; }
  get nonce(): any | number { return this._aOriginalTransactionRequest.nonce; }
  get gasLimit(): any | BigNumberish { return this._aOriginalTransactionRequest.gasLimit; }
  get gasPrice(): any | BigNumberish { return this._aOriginalTransactionRequest.gasPrice; }
  get maxPriorityFeePerGas(): any | BigNumberish { return this._aOriginalTransactionRequest.maxPriorityFeePerGas; }
  get maxFeePerGas(): any | BigNumberish { return this._aOriginalTransactionRequest.maxFeePerGas; }
  get value(): any | BigNumberish { return this._aOriginalTransactionRequest.value; }
  get accessList(): any | AccessListish { return this._aOriginalTransactionRequest.accessList; }
  get customData(): any { return this._aOriginalTransactionRequest.customData; }
  get blockTag(): undefined | BlockTag { return this._aOriginalTransactionRequest.blockTag; }
  get enableCcipRead(): undefined | boolean { return this._aOriginalTransactionRequest.enableCcipRead; }
}
