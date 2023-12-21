import { Provider } from 'ethers';
import { LacchainSigner } from '../lacchain-signer';
import {
  aPrivateKey,
  aNodeAddress,
  anExpirationTime,
  anOriginalTxRequest,
  aSignedTxRequest,
} from './fixtures';

describe('LacchainSigner', () => {
  let signer: LacchainSigner;

  const aProvider = {} as Provider;

  beforeEach(() => {
    signer = new LacchainSigner(
      aPrivateKey,
      aProvider,
      aNodeAddress,
      anExpirationTime,
    );
  });

  test('new', () => {
    expect(signer).toBeTruthy();
  });

  test('signTransaction', async () => {
    expect(await signer.signTransaction(anOriginalTxRequest)).toEqual(
      aSignedTxRequest,
    );
  });
});
