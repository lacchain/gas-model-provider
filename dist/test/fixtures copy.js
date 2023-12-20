"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testAddresses = exports.aSignedTxRequest = exports.anOriginalTxRequest = exports.aNodeAddress = exports.anExpirationTime = exports.aPrivateKey = void 0;
exports.aPrivateKey = '9ea92b45be8c30b18da6857cf60cfec534c0d612af34b291fd022ac4573e617c';
exports.anExpirationTime = 1836394529;
exports.aNodeAddress = '0xc6e2459991BfE27cca6d86722F35da23A1E4Cb97';
exports.anOriginalTxRequest = {
    type: 0,
    to: '0x4F3F9061c42B396746Bb9A232089703E4f9DBF76',
    from: null,
    nonce: 71,
    gasLimit: '1234',
    gasPrice: '0',
    maxPriorityFeePerGas: null,
    maxFeePerGas: null,
    data: '0x52c28fab000000000000000000000000e81d7e5cd979be0a7f6b6c98957a66fdf6240273000000000000000000000000410bd47227a5ea8af81995fa3d66b770af6f85e2',
    value: 0,
    chainId: 1234,
    accessList: null,
    customData: undefined,
    blockTag: undefined,
    enableCcipRead: undefined,
};
exports.aSignedTxRequest = '0xf8e447808204d2944f3f9061c42b396746bb9a232089703e4f9dbf7680b88452c28fab000000000000000000000000e81d7e5cd979be0a7f6b6c98957a66fdf6240273000000000000000000000000410bd47227a5ea8af81995fa3d66b770af6f85e2000000000000000000000000c6e2459991bfe27cca6d86722f35da23a1e4cb97000000000000000000000000000000000000000000000000000000006d7528211ba0c82f7051ffec883df1a1ce7fbe735cbd61900b8957362709b3614bd3c3309418a03f6b1897320a809a93c17ccc26130a0918a995cfb14fcd7c4108b35778003ab7';
exports.testAddresses = ['0xE81D7E5Cd979be0a7F6B6c98957A66fdF6240273', '0x410bd47227a5EA8AF81995Fa3d66B770aF6F85e2'];
