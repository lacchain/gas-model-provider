import 'mocha';
import {ethers} from "ethers";
import * as chai from "chai";
import lacchain from "../src";
import {PKD} from "./fixtures";

const expect = chai.expect;
chai.should();

describe('Tests', () => {

        let contractAddress = "0xf6F2B3665E5A596780A4Ee9247A1cA409bd9Edc2";
        const provider = new lacchain.GasModelProvider('http://34.73.228.200')
        const privateKey = '0E273FFD9CF5214F7D6ADE5D1ABFD6D101B648AF12BC2DE6AC4AFCB4DB805CD3'
        const nodeAddress = '0x971bb94d235a4ba42d53ab6fb0a86b12c73ba460';
        const expiration = 1736394529;
        const signer = new lacchain.GasModelSigner(privateKey, provider, nodeAddress, expiration);

        it('should deploy contract', async () => {
            const factory = new ethers.ContractFactory(PKD.abi, PKD.bytecode, signer)
            const contract = await factory.deploy({gasLimit: 1588811, gasPrice: 0})
            const receipt = await contract.deployTransaction.wait();
            console.log(`Deployment successful! Contract Address: ${receipt.contractAddress}`);
            expect(receipt.contractAddress).to.not.null;
            contractAddress = receipt.contractAddress;
            return false;
        });

        it('should send a transaction', async () => {
            const contract = new ethers.Contract(contractAddress, PKD.abi, signer);
            const stored = await contract.publicKeys('0x173CF75f0905338597fcd38F5cE13E6840b230e9');
            expect(stored).to.not.null;
            return false;
        });
    }
);