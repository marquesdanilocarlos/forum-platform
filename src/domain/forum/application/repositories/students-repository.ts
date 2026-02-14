import Student from '@/domain/forum/enterprise/entities/student'

export default abstract class StudentsRepository {
  abstract findByEmail(email: string): Promise<Student | null>
  abstract create(student: Student): Promise<void>
}
