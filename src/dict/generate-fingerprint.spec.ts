import { generateFingerprint } from './generate-fingerprint';

describe('generate fingerprint', () => {
  it('generate from markdown', async () => {
    generateFingerprint('Communicating with backend services using HTTP', 'markdown');
  });
});
