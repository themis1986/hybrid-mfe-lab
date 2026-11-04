import { createRemoteHost } from './RemoteMfeHost'

export const CRYPTO_BASE_PATH = '/crypto-app'

export const CryptoMfeHost = createRemoteHost(
  () => import('crypto/mount'),
  CRYPTO_BASE_PATH,
  'Crypto market',
)
