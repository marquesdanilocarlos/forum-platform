import { PrismaService } from '@/infra/database/prisma/prisma.service'
import makeStudent from './make-student'
import { StudentProps } from '@/domain/forum/enterprise/entities/student'
import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/prisma-student.mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export default class StudentPrismaFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaStudent(data: Partial<StudentProps>) {
    const student = makeStudent(data)

    await this.prisma.user.create({
      data: PrismaStudentMapper.toPersistent(student),
    })

    return student
  }
}
