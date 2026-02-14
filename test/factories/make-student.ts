import Student, {
  StudentProps,
} from '@/domain/forum/enterprise/entities/student'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'

export default function makeStudent(
  override: Partial<StudentProps> = {},
  id?: string,
): Student {
  return Student.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    new UniqueEntityId(id),
  )
}
