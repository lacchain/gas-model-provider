import {ethers, Wallet, Transaction} from "ethers";
import {serialize} from "@ethersproject/transactions";
import {BytesLike} from "@ethersproject/bytes";
import {ExternallyOwnedAccount} from "@ethersproject/abstract-signer";
import {SigningKey} from "@ethersproject/signing-key";
import {Provider, TransactionRequest} from "@ethersproject/abstract-provider";

export class GasModelSigner extends Wallet {
    private readonly nodeAddress: string;
    private readonly expiration: number;

    constructor(privateKey: BytesLike | ExternallyOwnedAccount | SigningKey, provider: Provider, nodeAddress: string, expiration: number) {
        super(privateKey, provider);
        this.nodeAddress = nodeAddress;
        this.expiration = expiration;
    }

    signTransaction(transaction: TransactionRequest) {
        return ethers.utils.resolveProperties(<Transaction>transaction).then((tx: Transaction) => {
            if (tx.from !== null) {
                delete tx.from;
            }
            const value = ethers.utils.defaultAbiCoder
                .encode(["address", "uint256"], [this.nodeAddress, this.expiration]);

            tx.data = tx.data + value.substring(2);
            tx.chainId = 0;
            const signature = this._signingKey().signDigest(ethers.utils.keccak256(serialize(tx)));
            return serialize(tx, signature);
        });
    }
}