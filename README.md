## LAC-NET Gas Model provider for ether.js

This repository contains the GasModelProvider ethers.js provider, an additional Provider to ethers.js to enable work with the gas model of LAC-NET.

### Usage
``` javascript
import provider from "@lacchain/gas-model-provider";

const provider = new provider.GasModelProvider( RPC_URL );
const signer = new provider.GasModelSigner( PRIVATE_KEY, provider, NODE_ADDRESS, EXPIRATION );
```

Where:
 - RPC_URL: the RPC url of your node (i.e. http://node-ip)
 - PRIVATE_KEY: is the ethereum account private key in hex
 - NODE_ADDRESS: the node address 
 - EXPIRATION: the expiration unix timestamp of the transaction

### Example

#### Deploy smart contract

``` javascript
import ethers from "ethers";

const factory = new ethers.ContractFactory( CONTRACT_ABI, CONTRACT_BYTECODE, signer )
const contract = await factory.deploy( { gasLimit: 100000, gasPrice: 0 } )
const receipt = await contract.deployTransaction.wait();
console.log( `Contract Address: ${receipt.contractAddress}` );
contractAddress = receipt.contractAddress;
```

Where:
 - CONTRACT_ABI: is the contract ABI
 - CONTRACT_BYTECODE: is the contract bytecode

**Note: Don't use contract.address, instead use the example code above to get the contract address**

#### Invoke and call contract

``` javascript
const hash = "0x7465737400000000000000000000000000000000000000000000000000000000";
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
const tx = await contract.store(hash);
const receipt = await tx.wait();
console.log('Receipt', receipt);
const stored = await contract.retreiveHash(SENDER_ADDRESS);
console.log(stored);
```

Where:
- CONTRACT_ADDRESS: is the contract address
- CONTRACT_ABI: is the contract ABI
- SENDER_ADDRESS: is the sender address


## Licence

Copyright 2022 LACChain

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.