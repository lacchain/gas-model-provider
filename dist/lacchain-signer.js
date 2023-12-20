"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LacchainSigner = void 0;
const ethers_1 = require("ethers");
const lacchain_transaction_request_1 = require("./lacchain-transaction-request");
class LacchainSigner extends ethers_1.Wallet {
    constructor(privateKey, provider, _aNodeAddress, _aExpirationTime) {
        super(privateKey, provider);
        this._aNodeAddress = _aNodeAddress;
        this._aExpirationTime = _aExpirationTime;
    }
    signTransaction(transactionRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            // Replace any Addressable or ENS name with an address
            const { to, from } = yield (0, ethers_1.resolveProperties)({
                to: transactionRequest.to ? (0, ethers_1.resolveAddress)(transactionRequest.to, this.provider) : undefined,
                from: transactionRequest.from ? (0, ethers_1.resolveAddress)(transactionRequest.from, this.provider) : undefined,
            });
            if (to != null) {
                transactionRequest.to = to;
            }
            if (from != null) {
                transactionRequest.from = from;
            }
            if (transactionRequest.from != null) {
                (0, ethers_1.assertArgument)((0, ethers_1.getAddress)(transactionRequest.from) === this.address, 'transaction from address mismatch', 'tx.from', transactionRequest.from);
                delete transactionRequest.from;
            }
            const btx = ethers_1.Transaction.from((new lacchain_transaction_request_1.LacchainTransactionRequest(transactionRequest, this._aNodeAddress, this._aExpirationTime)));
            btx.signature = this.signingKey.sign(btx.unsignedHash);
            return btx.serialized;
        });
    }
}
exports.LacchainSigner = LacchainSigner;
//# sourceMappingURL=lacchain-signer.js.map