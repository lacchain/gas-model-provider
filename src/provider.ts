import {providers} from "ethers";
import {hexlify} from "@ethersproject/bytes"

export class GasModelProvider extends providers.JsonRpcProvider {

    async perform(method: string, params: any) {
        const result = await super.perform(method, params);
        if (method === 'getTransactionReceipt' && result) {
            delete result.root;
            result.confirmations = 1
        }
        return result;
    }

    async sendTransaction(transaction: string | Promise<string>) {
        await this.getNetwork();
        const hexTx = await Promise.resolve(transaction).then((t: string) => hexlify(t));
        const tx = this.formatter.transaction(transaction);
        if (tx.confirmations == null) {
            tx.confirmations = 0;
        }
        const blockNumber = await this._getInternalBlockNumber(100 + 2 * this.pollingInterval);
        try {
            const hash = await this.perform("sendTransaction", {signedTransaction: hexTx});
            tx.hash = hash;
            return this._wrapTransaction(tx, hash, blockNumber);
        } catch (error) {
            (<any>error).transaction = tx;
            (<any>error).transactionHash = tx.hash;
            throw error;
        }
    }
}