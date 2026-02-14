import Student from '@/domain/forum/enterprise/entities/student'
import StudentsRepository from '@/domain/forum/application/repositories/students-repository'

export default class InMemoryStudentsRepository implements StudentsRepository {
  public students: Student[] = []

  async findByEmail(id: string): Promise<Student | null> {
    const student =
      this.students.find((student) => student.email === id) ?? null
    return Promise.resolve(student)
  }

  async create(student: Student): Promise<void> {
    this.students.push(student)
  }
}
