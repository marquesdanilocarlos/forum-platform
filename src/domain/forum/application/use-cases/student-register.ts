import Student from '@/domain/forum/enterprise/entities/student'
import StudentsRepository from '@/domain/forum/application/repositories/students-repository'
import Hasher from '@/domain/forum/application/cryptography/hasher'
import StudentAlreadyExistsError from '@/domain/forum/application/use-cases/errors/student-already-exists.error'
import { Injectable } from '@nestjs/common'

export type StudentRegisterInput = {
  name: string
  email: string
  password: string
}

type StudentRegisterOutput = {
  student: Student
}

@Injectable()
export default abstract class StudentRegister {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: Hasher,
  ) {}

  async execute({
    name,
    email,
    password,
  }: StudentRegisterInput): Promise<StudentRegisterOutput> {
    const existingStudent = await this.studentsRepository.findByEmail(email)

    if (existingStudent) {
      throw new StudentAlreadyExistsError(existingStudent.name)
    }

    const hashPassword = await this.hashGenerator.hash(password)
    const student = Student.create({ name, email, password: hashPassword })
    await this.studentsRepository.create(student)
    return { student }
  }
}
