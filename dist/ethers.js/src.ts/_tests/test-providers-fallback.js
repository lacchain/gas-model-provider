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
exports.MockProvider = void 0;
const assert_1 = __importDefault(require("assert"));
const index_js_1 = require("../index.js");
const network = index_js_1.Network.from("mainnet");
function stall(duration) {
    return new Promise((resolve) => { setTimeout(resolve, duration); });
}
class MockProvider extends index_js_1.AbstractProvider {
    constructor(perform) {
        super(network, { cacheTimeout: -1 });
        this._perform = perform;
    }
    _detectNetwork() {
        return __awaiter(this, void 0, void 0, function* () { return network; });
    }
    perform(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._perform(req);
        });
    }
}
exports.MockProvider = MockProvider;
describe("Test Fallback broadcast", function () {
    const txHash = "0x33017397ef7c7943dee3b422aec52b0a210de58d73d49c1b3ce455970f01c83a";
    function test(actions) {
        return __awaiter(this, void 0, void 0, function* () {
            // https://sepolia.etherscan.io/tx/0x33017397ef7c7943dee3b422aec52b0a210de58d73d49c1b3ce455970f01c83a
            const tx = "0x02f87683aa36a7048459682f00845d899ef982520894b5bdaa442bb34f27e793861c456cd5bdc527ac8c89056bc75e2d6310000080c001a07503893743e94445b2361a444343757e6f59d52e19e9b3f65eb138d802eaa972a06e4e9bc10ff55474f9aac0a4c284733b4195cb7b273de5e7465ce75a168e0c38";
            const providers = actions.map(({ timeout, error }) => {
                return new MockProvider((r) => __awaiter(this, void 0, void 0, function* () {
                    if (r.method === "getBlockNumber") {
                        return 1;
                    }
                    if (r.method === "broadcastTransaction") {
                        yield stall(timeout);
                        if (error) {
                            throw error;
                        }
                        return txHash;
                    }
                    throw new Error(`unhandled method: ${r.method}`);
                }));
            });
            ;
            const provider = new index_js_1.FallbackProvider(providers);
            return yield provider.broadcastTransaction(tx);
        });
    }
    it("picks late non-failed broadcasts", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield test([
                { timeout: 200, error: (0, index_js_1.makeError)("already seen", "UNKNOWN_ERROR") },
                { timeout: 4000, error: (0, index_js_1.makeError)("already seen", "UNKNOWN_ERROR") },
                { timeout: 400 },
            ]);
            (0, assert_1.default)(result.hash === txHash, "result.hash === txHash");
        });
    });
    it("picks late non-failed broadcasts with quorum-met red-herrings", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield test([
                { timeout: 200, error: (0, index_js_1.makeError)("bad nonce", "NONCE_EXPIRED") },
                { timeout: 400, error: (0, index_js_1.makeError)("bad nonce", "NONCE_EXPIRED") },
                { timeout: 1000 },
            ]);
            (0, assert_1.default)(result.hash === txHash, "result.hash === txHash");
        });
    });
    it("insufficient funds short-circuit broadcast", function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield assert_1.default.rejects(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const result = yield test([
                        { timeout: 200, error: (0, index_js_1.makeError)("is broke", "INSUFFICIENT_FUNDS") },
                        { timeout: 400, error: (0, index_js_1.makeError)("is broke", "INSUFFICIENT_FUNDS") },
                        { timeout: 800 },
                        { timeout: 1000 },
                    ]);
                    console.log(result);
                });
            }, function (error) {
                (0, assert_1.default)((0, index_js_1.isError)(error, "INSUFFICIENT_FUNDS"));
                return true;
            });
        });
    });
});
describe("Test Inflight Quorum", function () {
    // Fires the %%actions%% as providers which will delay before returning,
    // and returns an array of arrays, where each sub-array indicates which
    // providers were inflight at once.
    function test(actions, quorum) {
        return __awaiter(this, void 0, void 0, function* () {
            const inflights = [[]];
            const configs = actions.map(({ delay, stallTimeout, priority, weight }, index) => ({
                provider: new MockProvider((r) => __awaiter(this, void 0, void 0, function* () {
                    if (r.method === "getBlockNumber") {
                        return 1;
                    }
                    if (r.method === "getBalance") {
                        // Add this as inflight
                        let last = inflights.pop();
                        if (last == null) {
                            throw new Error("no elements");
                        }
                        inflights.push(last);
                        last = last.slice();
                        last.push(index);
                        inflights.push(last);
                        // Do the thing
                        yield stall(delay);
                        // Remove as inflight
                        last = inflights.pop();
                        if (last == null) {
                            throw new Error("no elements");
                        }
                        inflights.push(last);
                        last = last.filter((v) => (v !== index));
                        inflights.push(last);
                        return 0;
                    }
                    console.log(r);
                    throw new Error(`unhandled method: ${r.method}`);
                })),
                stallTimeout, priority, weight
            }));
            const provider = new index_js_1.FallbackProvider(configs, network, {
                cacheTimeout: -1, pollingInterval: 100,
                quorum
            });
            yield provider.getBalance(index_js_1.ZeroAddress);
            return inflights;
        });
    }
    // See: #4298
    it("applies weights against inflight requests", function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.timeout(2000);
            const inflights = yield test([
                { delay: 50, stallTimeout: 1000, priority: 1, weight: 2 },
                { delay: 50, stallTimeout: 1000, priority: 1, weight: 2 },
            ], 2);
            // Make sure there is never more than 1 inflight provider at once
            for (const running of inflights) {
                assert_1.default.ok(running.length <= 1, `too many inflight requests: ${JSON.stringify(inflights)}`);
            }
        });
    });
    // @TODO: add lots more tests, checking on priority, weight and stall
    //        configurations
});
//# sourceMappingURL=test-providers-fallback.js.map