import StudentsRepository from '@/domain/forum/application/repositories/students-repository'
import Encrypter from '@/domain/forum/application/cryptography/encrypter'
import HashComparer from '@/domain/forum/application/cryptography/hash-comparer'
import WrongCredentialsError from '@/domain/forum/application/use-cases/errors/wrong-credentials.error'
import { Injectable } from '@nestjs/common'

type StudentAuthenticateInput = {
  email: string
  password: string
}

type StudentAuthenticateOutput = {
  accessToken: string
}

@Injectable()
export default class StudentAuthenticate {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: StudentAuthenticateInput): Promise<StudentAuthenticateOutput> {
    const existingStudent = await this.studentsRepository.findByEmail(email)

    if (!existingStudent) {
      throw new WrongCredentialsError()
    }

    const isValidPassword = await this.hashComparer.compare(
      password,
      existingStudent.password,
    )

    if (!isValidPassword) {
      throw new WrongCredentialsError()
    }

    const accessToken = await this.encrypter.encrypt({
      sub: existingStudent.id.value,
    })

    return { accessToken }
  }
}
