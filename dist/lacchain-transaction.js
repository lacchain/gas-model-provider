"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LacchainTransaction = void 0;
class LacchainTransaction {
    constructor(_aOriginalTx, _aHashTx) {
        this._aOriginalTx = _aOriginalTx;
        this._aHashTx = _aHashTx;
    }
    get hash() {
        return this._aHashTx;
    }
    get type() { return this._aOriginalTx.type; }
    get typeName() { return this._aOriginalTx.typeName; }
    get to() { return this._aOriginalTx.to; }
    get nonce() { return this._aOriginalTx.nonce; }
    get gasLimit() { return this._aOriginalTx.gasLimit; }
    get gasPrice() { return this._aOriginalTx.gasPrice; }
    get maxPriorityFeePerGas() { return this._aOriginalTx.maxPriorityFeePerGas; }
    get maxFeePerGas() { return this._aOriginalTx.maxFeePerGas; }
    get data() { return this._aOriginalTx.data; }
    get value() { return this._aOriginalTx.value; }
    get chainId() { return this._aOriginalTx.chainId; }
    get signature() { return this._aOriginalTx.signature || null; }
    get accessList() { return this._aOriginalTx.accessList; }
    get unsignedHash() { return this._aOriginalTx.unsignedHash; }
    get from() { return this._aOriginalTx.from; }
    get fromPublicKey() { return this._aOriginalTx.fromPublicKey; }
    get serialized() { return this._aOriginalTx.serialized; }
    get unsignedSerialized() { return this._aOriginalTx.unsignedSerialized; }
}
exports.LacchainTransaction = LacchainTransaction;
//# sourceMappingURL=lacchain-transaction.js.map