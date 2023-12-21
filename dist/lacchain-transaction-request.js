"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LacchainTransactionRequest = void 0;
const ethers_1 = require("ethers");
class LacchainTransactionRequest {
    constructor(_aOriginalTransactionRequest, _aNodeAddress, _aExpirationTime) {
        this._aOriginalTransactionRequest = _aOriginalTransactionRequest;
        this._aNodeAddress = _aNodeAddress;
        this._aExpirationTime = _aExpirationTime;
    }
    get data() {
        return this._aOriginalTransactionRequest.data + ethers_1.AbiCoder.defaultAbiCoder().encode(["address", "uint256"], [this._aNodeAddress, this._aExpirationTime]).substring(2);
        ;
    }
    get chainId() { return 0; }
    get type() { return this._aOriginalTransactionRequest.type; }
    get to() { return this._aOriginalTransactionRequest.to; }
    get from() { return this._aOriginalTransactionRequest.from; }
    get nonce() { return this._aOriginalTransactionRequest.nonce; }
    get gasLimit() { return this._aOriginalTransactionRequest.gasLimit; }
    get gasPrice() { return this._aOriginalTransactionRequest.gasPrice; }
    get maxPriorityFeePerGas() { return this._aOriginalTransactionRequest.maxPriorityFeePerGas; }
    get maxFeePerGas() { return this._aOriginalTransactionRequest.maxFeePerGas; }
    get value() { return this._aOriginalTransactionRequest.value; }
    get accessList() { return this._aOriginalTransactionRequest.accessList; }
    get customData() { return this._aOriginalTransactionRequest.customData; }
    get blockTag() { return this._aOriginalTransactionRequest.blockTag; }
    get enableCcipRead() { return this._aOriginalTransactionRequest.enableCcipRead; }
}
exports.LacchainTransactionRequest = LacchainTransactionRequest;
//# sourceMappingURL=lacchain-transaction-request.js.map