import { env } from 'process';
import { ContractFactory, Contract } from 'ethers';
import * as dotenv from 'dotenv';
import { aTestContract } from './test-contract';
import { LacchainProvider } from '../../lacchain-provider';
import { LacchainSigner } from '../../lacchain-signer';
import { aPrivateKey, anExpirationTime, testAddresses } from '../fixtures';



describe('e2e Provider & Signer re', () => {

  dotenv.config();

  const { RPC_URL, NODE_ADDRESS, TRUSTED_FORWARDER } = env;


  const signer: LacchainSigner = new LacchainSigner(
    aPrivateKey,
    new LacchainProvider(RPC_URL!),
    NODE_ADDRESS!,
    anExpirationTime
  );
console.log("set network")
  const _deployContract = async () => {
    const contractFactory = new ContractFactory(
      aTestContract.abi,
      aTestContract.bytecode,
      signer
    );
    
    const contract = await contractFactory.deploy(signer.address, TRUSTED_FORWARDER!);
    
    return await contract.deploymentTransaction()?.wait();
  };

  test('Deploy & Transaction re', async () => {
    const txReceipt = await _deployContract();
    const contractAddress = txReceipt?.contractAddress || '';
    console.log(contractAddress)
    expect(contractAddress).toBeTruthy();

    const contract = new Contract(contractAddress, aTestContract.abi, signer);

    await (await contract.add(testAddresses[0], testAddresses[1])).wait();

    expect(await contract.exists(testAddresses[0], testAddresses[1])).toEqual(true);
  }, 100000000);
});
