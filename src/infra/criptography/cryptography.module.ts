import { Module } from '@nestjs/common'
import Encrypter from '@/domain/forum/application/cryptography/encrypter'
import JwtEncrypter from '@/infra/criptography/jwt-encrypter'
import Hasher from '@/domain/forum/application/cryptography/hasher'
import BcryptHasher from '@/infra/criptography/bcrypt-hasher'
import HashComparer from '@/domain/forum/application/cryptography/hash-comparer'

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: Hasher,
      useClass: BcryptHasher,
    },
    {
      provide: HashComparer,
      useClass: BcryptHasher,
    },
  ],
  exports: [Encrypter, Hasher, HashComparer],
})
export class CryptographyModule {}
