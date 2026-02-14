import Entity from '@/core/entities/entity'
import UniqueEntityId from '@/core/entities/unique-entity-id'

type StudentProps = {
  name: string
  email: string
  password: string
}

export default class Student extends Entity<StudentProps> {
  public static create(props: StudentProps, id?: UniqueEntityId): Student {
    return new Student(props, id)
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }
}
