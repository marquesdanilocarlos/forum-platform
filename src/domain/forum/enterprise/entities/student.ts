import Entity from '@/core/entities/entity'
import UniqueEntityId from '@/core/entities/unique-entity-id'

type StudentProps = {
  name: string
}

export class Student extends Entity<StudentProps> {
  public static create(props: StudentProps, id?: UniqueEntityId): Student {
    return new Student(props, id)
  }
}
