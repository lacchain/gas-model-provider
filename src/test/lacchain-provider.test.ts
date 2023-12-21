import { LacchainProvider } from '../lacchain-provider';

describe('LacchainProvider', () => {
  test('new', () => {
    expect(new LacchainProvider('http://test.test')).toBeTruthy();
  });
});
