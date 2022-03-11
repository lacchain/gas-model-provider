import 'mocha';
import {ethers} from "ethers";
import * as chai from "chai";
import {GasModelProvider, GasModelSigner} from "../src";
import {RegisterHashContract} from "./fixtures";

const expect = chai.expect;
chai.should();

describe('Tests', () => {

        let contractAddress = "";
        const provider = new GasModelProvider('http://34.69.22.82')
        const privateKey = '0E273FFD9CF5214F7D6ADE5D1ABFD6D101B648AF12BC2DE6AC4AFCB4DB805CD3'
        const nodeAddress = '0xd00e6624a73f88b39f82ab34e8bf2b4d226fd768';
        const expiration = 1736394529;
        const signer = new GasModelSigner(privateKey, provider, nodeAddress, expiration);

        it('should deploy contract', async () => {
            const factory = new ethers.ContractFactory(RegisterHashContract.abi, RegisterHashContract.bytecode, signer)
            const contract = await factory.deploy({gasLimit: 100000, gasPrice: 0})
            const receipt = await contract.deployTransaction.wait();
            console.log(`Deployment successful! Contract Address: ${receipt.contractAddress}`);
            expect(receipt.contractAddress).to.not.null;
            contractAddress = receipt.contractAddress;
            return false;
        });

        it('should send a transaction', async () => {
            const hash = "0x7465737400000000000000000000000000000000000000000000000000000000";
            const contract = new ethers.Contract(contractAddress, RegisterHashContract.abi, signer);
            const tx = await contract.store(hash);
            const receipt = await tx.wait();
            console.log('Receipt', receipt);
            const stored = await contract.retreiveHash('0x173CF75f0905338597fcd38F5cE13E6840b230e9');
            expect(stored).to.be.equals(hash);
            return false;
        });
    }
);