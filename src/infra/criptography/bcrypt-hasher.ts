import Hasher from '@/domain/forum/application/cryptography/hasher'
import HashComparer from '@/domain/forum/application/cryptography/hash-comparer'
import { hash, compare } from 'bcryptjs'

export default class BcryptHasher implements Hasher, HashComparer {
  private HASH_SALT_LENGTH = 8

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
