"use strict";
/**
 *  Generic long-lived socket provider.
 *
 *  Sub-classing notes
 *  - a sub-class MUST call the `_start()` method once connected
 *  - a sub-class MUST override the `_write(string)` method
 *  - a sub-class MUST call `_processMessage(string)` for each message
 *
 *  @_subsection: api/providers/abstract-provider:Socket Providers  [about-socketProvider]
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _SocketSubscriber_provider, _SocketSubscriber_filter, _SocketSubscriber_filterId, _SocketSubscriber_paused, _SocketSubscriber_emitPromise, _SocketEventSubscriber_logFilter, _SocketProvider_callbacks, _SocketProvider_subs, _SocketProvider_pending;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketProvider = exports.SocketEventSubscriber = exports.SocketPendingSubscriber = exports.SocketBlockSubscriber = exports.SocketSubscriber = void 0;
const abstract_provider_js_1 = require("./abstract-provider.js");
const index_js_1 = require("../utils/index.js");
const provider_jsonrpc_js_1 = require("./provider-jsonrpc.js");
/**
 *  A **SocketSubscriber** uses a socket transport to handle events and
 *  should use [[_emit]] to manage the events.
 */
class SocketSubscriber {
    /**
     *  The filter.
     */
    get filter() { return JSON.parse(__classPrivateFieldGet(this, _SocketSubscriber_filter, "f")); }
    /**
     *  Creates a new **SocketSubscriber** attached to %%provider%% listening
     *  to %%filter%%.
     */
    constructor(provider, filter) {
        _SocketSubscriber_provider.set(this, void 0);
        _SocketSubscriber_filter.set(this, void 0);
        _SocketSubscriber_filterId.set(this, void 0);
        _SocketSubscriber_paused.set(this, void 0);
        _SocketSubscriber_emitPromise.set(this, void 0);
        __classPrivateFieldSet(this, _SocketSubscriber_provider, provider, "f");
        __classPrivateFieldSet(this, _SocketSubscriber_filter, JSON.stringify(filter), "f");
        __classPrivateFieldSet(this, _SocketSubscriber_filterId, null, "f");
        __classPrivateFieldSet(this, _SocketSubscriber_paused, null, "f");
        __classPrivateFieldSet(this, _SocketSubscriber_emitPromise, null, "f");
    }
    start() {
        __classPrivateFieldSet(this, _SocketSubscriber_filterId, __classPrivateFieldGet(this, _SocketSubscriber_provider, "f").send("eth_subscribe", this.filter).then((filterId) => {
            ;
            __classPrivateFieldGet(this, _SocketSubscriber_provider, "f")._register(filterId, this);
            return filterId;
        }), "f");
    }
    stop() {
        (__classPrivateFieldGet(this, _SocketSubscriber_filterId, "f")).then((filterId) => {
            __classPrivateFieldGet(this, _SocketSubscriber_provider, "f").send("eth_unsubscribe", [filterId]);
        });
        __classPrivateFieldSet(this, _SocketSubscriber_filterId, null, "f");
    }
    // @TODO: pause should trap the current blockNumber, unsub, and on resume use getLogs
    //        and resume
    pause(dropWhilePaused) {
        (0, index_js_1.assert)(dropWhilePaused, "preserve logs while paused not supported by SocketSubscriber yet", "UNSUPPORTED_OPERATION", { operation: "pause(false)" });
        __classPrivateFieldSet(this, _SocketSubscriber_paused, !!dropWhilePaused, "f");
    }
    resume() {
        __classPrivateFieldSet(this, _SocketSubscriber_paused, null, "f");
    }
    /**
     *  @_ignore:
     */
    _handleMessage(message) {
        if (__classPrivateFieldGet(this, _SocketSubscriber_filterId, "f") == null) {
            return;
        }
        if (__classPrivateFieldGet(this, _SocketSubscriber_paused, "f") === null) {
            let emitPromise = __classPrivateFieldGet(this, _SocketSubscriber_emitPromise, "f");
            if (emitPromise == null) {
                emitPromise = this._emit(__classPrivateFieldGet(this, _SocketSubscriber_provider, "f"), message);
            }
            else {
                emitPromise = emitPromise.then(() => __awaiter(this, void 0, void 0, function* () {
                    yield this._emit(__classPrivateFieldGet(this, _SocketSubscriber_provider, "f"), message);
                }));
            }
            __classPrivateFieldSet(this, _SocketSubscriber_emitPromise, emitPromise.then(() => {
                if (__classPrivateFieldGet(this, _SocketSubscriber_emitPromise, "f") === emitPromise) {
                    __classPrivateFieldSet(this, _SocketSubscriber_emitPromise, null, "f");
                }
            }), "f");
        }
    }
    /**
     *  Sub-classes **must** override this to emit the events on the
     *  provider.
     */
    _emit(provider, message) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("sub-classes must implemente this; _emit");
        });
    }
}
exports.SocketSubscriber = SocketSubscriber;
_SocketSubscriber_provider = new WeakMap(), _SocketSubscriber_filter = new WeakMap(), _SocketSubscriber_filterId = new WeakMap(), _SocketSubscriber_paused = new WeakMap(), _SocketSubscriber_emitPromise = new WeakMap();
/**
 *  A **SocketBlockSubscriber** listens for ``newHeads`` events and emits
 *  ``"block"`` events.
 */
class SocketBlockSubscriber extends SocketSubscriber {
    /**
     *  @_ignore:
     */
    constructor(provider) {
        super(provider, ["newHeads"]);
    }
    _emit(provider, message) {
        return __awaiter(this, void 0, void 0, function* () {
            provider.emit("block", parseInt(message.number));
        });
    }
}
exports.SocketBlockSubscriber = SocketBlockSubscriber;
/**
 *  A **SocketPendingSubscriber** listens for pending transacitons and emits
 *  ``"pending"`` events.
 */
class SocketPendingSubscriber extends SocketSubscriber {
    /**
     *  @_ignore:
     */
    constructor(provider) {
        super(provider, ["newPendingTransactions"]);
    }
    _emit(provider, message) {
        return __awaiter(this, void 0, void 0, function* () {
            provider.emit("pending", message);
        });
    }
}
exports.SocketPendingSubscriber = SocketPendingSubscriber;
/**
 *  A **SocketEventSubscriber** listens for event logs.
 */
class SocketEventSubscriber extends SocketSubscriber {
    /**
     *  The filter.
     */
    get logFilter() { return JSON.parse(__classPrivateFieldGet(this, _SocketEventSubscriber_logFilter, "f")); }
    /**
     *  @_ignore:
     */
    constructor(provider, filter) {
        super(provider, ["logs", filter]);
        _SocketEventSubscriber_logFilter.set(this, void 0);
        __classPrivateFieldSet(this, _SocketEventSubscriber_logFilter, JSON.stringify(filter), "f");
    }
    _emit(provider, message) {
        return __awaiter(this, void 0, void 0, function* () {
            provider.emit(this.logFilter, provider._wrapLog(message, provider._network));
        });
    }
}
exports.SocketEventSubscriber = SocketEventSubscriber;
_SocketEventSubscriber_logFilter = new WeakMap();
/**
 *  A **SocketProvider** is backed by a long-lived connection over a
 *  socket, which can subscribe and receive real-time messages over
 *  its communication channel.
 */
class SocketProvider extends provider_jsonrpc_js_1.JsonRpcApiProvider {
    /**
     *  Creates a new **SocketProvider** connected to %%network%%.
     *
     *  If unspecified, the network will be discovered.
     */
    constructor(network, _options) {
        // Copy the options
        const options = Object.assign({}, (_options != null) ? _options : {});
        // Support for batches is generally not supported for
        // connection-base providers; if this changes in the future
        // the _send should be updated to reflect this
        (0, index_js_1.assertArgument)(options.batchMaxCount == null || options.batchMaxCount === 1, "sockets-based providers do not support batches", "options.batchMaxCount", _options);
        options.batchMaxCount = 1;
        // Socket-based Providers (generally) cannot change their network,
        // since they have a long-lived connection; but let people override
        // this if they have just cause.
        if (options.staticNetwork == null) {
            options.staticNetwork = true;
        }
        super(network, options);
        _SocketProvider_callbacks.set(this, void 0);
        // Maps each filterId to its subscriber
        _SocketProvider_subs.set(this, void 0);
        // If any events come in before a subscriber has finished
        // registering, queue them
        _SocketProvider_pending.set(this, void 0);
        __classPrivateFieldSet(this, _SocketProvider_callbacks, new Map(), "f");
        __classPrivateFieldSet(this, _SocketProvider_subs, new Map(), "f");
        __classPrivateFieldSet(this, _SocketProvider_pending, new Map(), "f");
    }
    // This value is only valid after _start has been called
    /*
    get _network(): Network {
        if (this.#network == null) {
            throw new Error("this shouldn't happen");
        }
        return this.#network.clone();
    }
    */
    _getSubscriber(sub) {
        switch (sub.type) {
            case "close":
                return new abstract_provider_js_1.UnmanagedSubscriber("close");
            case "block":
                return new SocketBlockSubscriber(this);
            case "pending":
                return new SocketPendingSubscriber(this);
            case "event":
                return new SocketEventSubscriber(this, sub.filter);
            case "orphan":
                // Handled auto-matically within AbstractProvider
                // when the log.removed = true
                if (sub.filter.orphan === "drop-log") {
                    return new abstract_provider_js_1.UnmanagedSubscriber("drop-log");
                }
        }
        return super._getSubscriber(sub);
    }
    /**
     *  Register a new subscriber. This is used internalled by Subscribers
     *  and generally is unecessary unless extending capabilities.
     */
    _register(filterId, subscriber) {
        __classPrivateFieldGet(this, _SocketProvider_subs, "f").set(filterId, subscriber);
        const pending = __classPrivateFieldGet(this, _SocketProvider_pending, "f").get(filterId);
        if (pending) {
            for (const message of pending) {
                subscriber._handleMessage(message);
            }
            __classPrivateFieldGet(this, _SocketProvider_pending, "f").delete(filterId);
        }
    }
    _send(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            // WebSocket provider doesn't accept batches
            (0, index_js_1.assertArgument)(!Array.isArray(payload), "WebSocket does not support batch send", "payload", payload);
            // @TODO: stringify payloads here and store to prevent mutations
            // Prepare a promise to respond to
            const promise = new Promise((resolve, reject) => {
                __classPrivateFieldGet(this, _SocketProvider_callbacks, "f").set(payload.id, { payload, resolve, reject });
            });
            // Wait until the socket is connected before writing to it
            yield this._waitUntilReady();
            // Write the request to the socket
            yield this._write(JSON.stringify(payload));
            return [yield promise];
        });
    }
    // Sub-classes must call this once they are connected
    /*
    async _start(): Promise<void> {
        if (this.#ready) { return; }

        for (const { payload } of this.#callbacks.values()) {
            await this._write(JSON.stringify(payload));
        }

        this.#ready = (async function() {
            await super._start();
        })();
    }
    */
    /**
     *  Sub-classes **must** call this with messages received over their
     *  transport to be processed and dispatched.
     */
    _processMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (JSON.parse(message));
            if (result && typeof (result) === "object" && "id" in result) {
                const callback = __classPrivateFieldGet(this, _SocketProvider_callbacks, "f").get(result.id);
                if (callback == null) {
                    this.emit("error", (0, index_js_1.makeError)("received result for unknown id", "UNKNOWN_ERROR", {
                        reasonCode: "UNKNOWN_ID",
                        result
                    }));
                    return;
                }
                __classPrivateFieldGet(this, _SocketProvider_callbacks, "f").delete(result.id);
                callback.resolve(result);
            }
            else if (result && result.method === "eth_subscription") {
                const filterId = result.params.subscription;
                const subscriber = __classPrivateFieldGet(this, _SocketProvider_subs, "f").get(filterId);
                if (subscriber) {
                    subscriber._handleMessage(result.params.result);
                }
                else {
                    let pending = __classPrivateFieldGet(this, _SocketProvider_pending, "f").get(filterId);
                    if (pending == null) {
                        pending = [];
                        __classPrivateFieldGet(this, _SocketProvider_pending, "f").set(filterId, pending);
                    }
                    pending.push(result.params.result);
                }
            }
            else {
                this.emit("error", (0, index_js_1.makeError)("received unexpected message", "UNKNOWN_ERROR", {
                    reasonCode: "UNEXPECTED_MESSAGE",
                    result
                }));
                return;
            }
        });
    }
    /**
     *  Sub-classes **must** override this to send %%message%% over their
     *  transport.
     */
    _write(message) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("sub-classes must override this");
        });
    }
}
exports.SocketProvider = SocketProvider;
_SocketProvider_callbacks = new WeakMap(), _SocketProvider_subs = new WeakMap(), _SocketProvider_pending = new WeakMap();
//# sourceMappingURL=provider-socket.js.map