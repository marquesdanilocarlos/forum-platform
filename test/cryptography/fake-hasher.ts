import Hasher from '@/domain/forum/application/cryptography/hasher'
import HashComparer from '@/domain/forum/application/cryptography/hash-comparer'

export default class FakeHasher implements Hasher, HashComparer {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
