import Encrypter from '@/domain/forum/application/cryptography/encrypter'

export default class FakeEncrypter implements Encrypter {
  encrypt(payload: Record<string, unknown>): Promise<string> {
    return Promise.resolve(JSON.stringify(payload))
  }
}
