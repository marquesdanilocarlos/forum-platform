import Entity from '@/core/entities/entity'
import UniqueEntityId from '@/core/entities/unique-entity-id'

type InstructorProps = {
  name: string
}

export class Instructor extends Entity<InstructorProps> {
  public static create(
    props: InstructorProps,
    id?: UniqueEntityId,
  ): Instructor {
    return new Instructor(props, id)
  }
}
