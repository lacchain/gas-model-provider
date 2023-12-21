"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const process_1 = require("process");
const ethers_1 = require("ethers");
const dotenv = __importStar(require("dotenv"));
const test_contract_1 = require("./test-contract");
const lacchain_provider_1 = require("../../lacchain-provider");
const lacchain_signer_1 = require("../../lacchain-signer");
const fixtures_1 = require("../fixtures");
describe('e2e Provider & Signer re', () => {
    dotenv.config();
    const { RPC_URL, NODE_ADDRESS, TRUSTED_FORWARDER } = process_1.env;
    const signer = new lacchain_signer_1.LacchainSigner(fixtures_1.aPrivateKey, new lacchain_provider_1.LacchainProvider(RPC_URL), NODE_ADDRESS, fixtures_1.anExpirationTime);
    console.log("set network");
    const _deployContract = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const contractFactory = new ethers_1.ContractFactory(test_contract_1.aTestContract.abi, test_contract_1.aTestContract.bytecode, signer);
        const contract = yield contractFactory.deploy(signer.address, TRUSTED_FORWARDER);
        return yield ((_a = contract.deploymentTransaction()) === null || _a === void 0 ? void 0 : _a.wait());
    });
    test('Deploy & Transaction re', () => __awaiter(void 0, void 0, void 0, function* () {
        const txReceipt = yield _deployContract();
        const contractAddress = (txReceipt === null || txReceipt === void 0 ? void 0 : txReceipt.contractAddress) || '';
        console.log(contractAddress);
        expect(contractAddress).toBeTruthy();
        const contract = new ethers_1.Contract(contractAddress, test_contract_1.aTestContract.abi, signer);
        yield (yield contract.add(fixtures_1.testAddresses[0], fixtures_1.testAddresses[1])).wait();
        expect(yield contract.exists(fixtures_1.testAddresses[0], fixtures_1.testAddresses[1])).toEqual(true);
    }), 100000000);
});
//# sourceMappingURL=deploy-and-tx.test.js.map