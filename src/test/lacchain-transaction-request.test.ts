import { LacchainTransactionRequest } from '../lacchain-transaction-request';
import {
  anOriginalTxRequest,
  aNodeAddress,
  anExpirationTime,
} from './fixtures';

describe('LacchainTransactionRequest', () => {
  let lacchainTxRequest: LacchainTransactionRequest;

  const lacchainDataExpected =
    '0x52c28fab000000000000000000000000e81d7e5cd979be0a7f6b6c98957a66fdf6240273000000000000000000000000410bd47227a5ea8af81995fa3d66b770af6f85e2000000000000000000000000c6e2459991bfe27cca6d86722f35da23a1e4cb97000000000000000000000000000000000000000000000000000000006d752821';

  beforeEach(() => {
    lacchainTxRequest = new LacchainTransactionRequest(
      anOriginalTxRequest,
      aNodeAddress,
      anExpirationTime,
    );
  });

  test('new', () => {
    expect(lacchainTxRequest).toBeTruthy();
  });

  test('type', () => {
    expect(lacchainTxRequest.type).toEqual(anOriginalTxRequest.type);
  });

  test('to', () => {
    expect(lacchainTxRequest.to).toEqual(anOriginalTxRequest.to);
  });

  test('from', () => {
    expect(lacchainTxRequest.from).toEqual(anOriginalTxRequest.from);
  });

  test('nonce', () => {
    expect(lacchainTxRequest.nonce).toEqual(anOriginalTxRequest.nonce);
  });

  test('gasLimit', () => {
    expect(lacchainTxRequest.gasLimit).toEqual(anOriginalTxRequest.gasLimit);
  });

  test('gasPrice', () => {
    expect(lacchainTxRequest.gasPrice).toEqual(anOriginalTxRequest.gasPrice);
  });

  test('maxPriorityFeePerGas', () => {
    expect(lacchainTxRequest.maxPriorityFeePerGas).toEqual(
      anOriginalTxRequest.maxPriorityFeePerGas,
    );
  });

  test('maxFeePerGas', () => {
    expect(lacchainTxRequest.maxFeePerGas).toEqual(
      anOriginalTxRequest.maxFeePerGas,
    );
  });

  test('data', () => {
    expect(lacchainTxRequest.data).toEqual(lacchainDataExpected);
  });

  test('value', () => {
    expect(lacchainTxRequest.value).toEqual(anOriginalTxRequest.value);
  });

  test('chainId', () => {
    expect(lacchainTxRequest.chainId).toEqual(0);
  });

  test('accessList', () => {
    expect(lacchainTxRequest.accessList).toEqual(
      anOriginalTxRequest.accessList,
    );
  });

  test('customData', () => {
    expect(lacchainTxRequest.customData).toEqual(
      anOriginalTxRequest.customData,
    );
  });

  test('blockTag', () => {
    expect(lacchainTxRequest.blockTag).toEqual(anOriginalTxRequest.blockTag);
  });

  test('enableCciRead', () => {
    expect(lacchainTxRequest.enableCcipRead).toEqual(
      anOriginalTxRequest.enableCcipRead,
    );
  });
});
