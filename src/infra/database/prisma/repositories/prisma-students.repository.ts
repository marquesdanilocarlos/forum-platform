import { Injectable } from '@nestjs/common'
import StudentsRepository from '@/domain/forum/application/repositories/students-repository'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/prisma-student.mapper'
import Student from '@/domain/forum/enterprise/entities/student'

@Injectable()
export class PrismaStudentsRepository extends StudentsRepository {
  constructor(private prisma: PrismaService) {
    super()
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!student) {
      return null
    }

    return PrismaStudentMapper.toDomain(student)
  }

  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPersistent(student)
    await this.prisma.user.create({ data })
  }
}
