import {
  LacchainSigner,
  LacchainProvider,
  LacchainTransaction,
  LacchainTransactionRequest,
} from '../index';

describe('index.ts', () => {
  test('exports', () => {
    expect(LacchainSigner).toBeTruthy();
    expect(LacchainProvider).toBeTruthy();
    expect(LacchainTransaction).toBeTruthy();
    expect(LacchainTransactionRequest).toBeTruthy();
  });
});
