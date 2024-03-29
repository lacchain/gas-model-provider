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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const index_js_1 = require("../index.js");
const create_provider_js_1 = require("./create-provider.js");
(0, create_provider_js_1.setupProviders)();
describe("Test CCIP execution", function () {
    // This matches the verify method in the Solidity contract against the
    // processed data from the endpoint
    const verify = function (sender, data, result) {
        const check = (0, index_js_1.concat)([
            (0, index_js_1.toBeArray)((0, index_js_1.dataLength)(sender)), sender,
            (0, index_js_1.toBeArray)((0, index_js_1.dataLength)(data)), data
        ]);
        assert_1.default.equal(result, (0, index_js_1.keccak256)(check), "response is equal");
    };
    const address = "0x6C5ed35574a9b4d163f75bBf0595F7540D8FCc2d";
    const calldata = "0x1234";
    it("testGet passes under normal operation", function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.timeout(60000);
            const provider = (0, create_provider_js_1.connect)("goerli");
            // testGet(bytes callData = "0x1234")
            const tx = {
                to: address, enableCcipRead: true,
                data: "0xa5f3271e000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000021234000000000000000000000000000000000000000000000000000000000000"
            };
            const result = yield provider.call(tx);
            verify(address, calldata, result);
        });
    });
    it("testGet should fail with CCIP not explicitly enabled by overrides", function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.timeout(60000);
            const provider = (0, create_provider_js_1.connect)("goerli");
            // testGet(bytes callData = "0x1234")
            const tx = {
                to: address,
                data: "0xa5f3271e000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000021234000000000000000000000000000000000000000000000000000000000000"
            };
            yield assert_1.default.rejects(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const result = yield provider.call(tx);
                    console.log(result);
                });
            }, (error) => {
                const offchainErrorData = "0x556f18300000000000000000000000006c5ed35574a9b4d163f75bbf0595f7540d8fcc2d00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000140b1494be100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004068747470733a2f2f6574686572732e7269636d6f6f2e776f726b6572732e6465762f746573742d636369702d726561642f7b73656e6465727d2f7b646174617d00000000000000000000000000000000000000000000000000000000000000021234000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d4d79206578747261206461746100000000000000000000000000000000000000";
                return ((0, index_js_1.isCallException)(error) && error.data === offchainErrorData);
            });
        });
    });
    it("testGet should fail with CCIP explicitly disabled on provider", function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.timeout(60000);
            const provider = (0, create_provider_js_1.connect)("goerli");
            provider.disableCcipRead = true;
            // testGetFail(bytes callData = "0x1234")
            const tx = {
                to: address, enableCcipRead: true,
                data: "0xa5f3271e000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000021234000000000000000000000000000000000000000000000000000000000000"
            };
            yield assert_1.default.rejects(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const result = yield provider.call(tx);
                    console.log(result);
                });
            }, (error) => {
                const offchainErrorData = "0x556f18300000000000000000000000006c5ed35574a9b4d163f75bbf0595f7540d8fcc2d00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000140b1494be100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004068747470733a2f2f6574686572732e7269636d6f6f2e776f726b6572732e6465762f746573742d636369702d726561642f7b73656e6465727d2f7b646174617d00000000000000000000000000000000000000000000000000000000000000021234000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d4d79206578747261206461746100000000000000000000000000000000000000";
                return ((0, index_js_1.isCallException)(error) && error.data === offchainErrorData);
            });
        });
    });
    it("testGetFail should fail if all URLs 5xx", function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.timeout(60000);
            const provider = (0, create_provider_js_1.connect)("goerli");
            // testGetFail(bytes callData = "0x1234")
            const tx = {
                to: address, enableCcipRead: true,
                data: "0x36f9cea6000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000021234000000000000000000000000000000000000000000000000000000000000"
            };
            yield assert_1.default.rejects(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const result = yield provider.call(tx);
                    console.log(result);
                });
            }, (error) => {
                const infoJson = '{"urls":["https:/\/ethers.ricmoo.workers.dev/status/500/{sender}/{data}"],"errorMessages":["hello world"]}';
                return ((0, index_js_1.isError)(error, "OFFCHAIN_FAULT") && error.reason === "500_SERVER_ERROR" &&
                    JSON.stringify(error.info) === infoJson);
            });
        });
    });
    it("testGetSenderFail should fail if sender does not match", function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.timeout(60000);
            const provider = (0, create_provider_js_1.connect)("goerli");
            // testGetSenderFail(bytes callData = "0x1234")
            const tx = {
                to: address, enableCcipRead: true,
                data: "0x64bff6d1000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000021234000000000000000000000000000000000000000000000000000000000000",
            };
            yield assert_1.default.rejects(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const result = yield provider.call(tx);
                    console.log(result);
                });
            }, (error) => {
                const errorArgsJson = '["0x0000000000000000000000000000000000000000",["https://ethers.ricmoo.workers.dev/test-ccip-read/{sender}/{data}"],"0x1234","0xb1494be1","0x4d792065787472612064617461"]';
                const offchainErrorData = "0x556f1830000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000140b1494be100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004068747470733a2f2f6574686572732e7269636d6f6f2e776f726b6572732e6465762f746573742d636369702d726561642f7b73656e6465727d2f7b646174617d00000000000000000000000000000000000000000000000000000000000000021234000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d4d79206578747261206461746100000000000000000000000000000000000000";
                return ((0, index_js_1.isCallException)(error) && error.data === offchainErrorData &&
                    error.revert &&
                    error.revert.signature === "OffchainLookup(address,string[],bytes,bytes4,bytes)" &&
                    JSON.stringify(error.revert.args) === errorArgsJson);
            });
        });
    });
    it("testGetMissing should fail if early URL 4xx", function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.timeout(60000);
            const provider = (0, create_provider_js_1.connect)("goerli");
            // testGetMissing(bytes callData = "0x1234")
            const tx = {
                to: address, enableCcipRead: true,
                data: "0x4ece8d7d000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000021234000000000000000000000000000000000000000000000000000000000000"
            };
            yield assert_1.default.rejects(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const result = yield provider.call(tx);
                    console.log(result);
                });
            }, (error) => {
                const infoJson = '{"url":"https:/\/ethers.ricmoo.workers.dev/status/404/{sender}/{data}","errorMessage":"hello world"}';
                return ((0, index_js_1.isError)(error, "OFFCHAIN_FAULT") && error.reason === "404_MISSING_RESOURCE" &&
                    JSON.stringify(error.info || "") === infoJson);
            });
        });
    });
    it("testGetFallback passes if any URL returns correctly", function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.timeout(60000);
            const provider = (0, create_provider_js_1.connect)("goerli");
            // testGetFallback(bytes callData = "0x1234")
            const tx = {
                to: address, enableCcipRead: true,
                data: "0xedf4a021000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000021234000000000000000000000000000000000000000000000000000000000000"
            };
            const result = yield provider.call(tx);
            verify(address, calldata, result);
        });
    });
    it("testPost passes under normal operation", function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.timeout(60000);
            const provider = (0, create_provider_js_1.connect)("goerli");
            // testPost(bytes callData = "0x1234")
            const tx = {
                to: address, enableCcipRead: true,
                data: "0x66cab49d000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000021234000000000000000000000000000000000000000000000000000000000000"
            };
            const result = yield provider.call(tx);
            verify(address, calldata, result);
        });
    });
});
//# sourceMappingURL=test-providers-ccip.js.map