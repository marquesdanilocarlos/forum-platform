import { User as PrismaStudent } from '../../../../../generated/prisma/client'
import Student from '@/domain/forum/enterprise/entities/student'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { UserUncheckedCreateInput as StudentUncheckedCreateInput } from '../../../../../generated/prisma/models/User'

export class PrismaStudentMapper {
  static toDomain(raw: PrismaStudent): Student {
    return Student.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistent(student: Student): StudentUncheckedCreateInput {
    return {
      id: student.id.value,
      name: student.name,
      email: student.email,
      password: student.password,
    }
  }
}
