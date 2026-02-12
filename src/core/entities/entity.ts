import UniqueEntityId from '@/core/entities/unique-entity-id'

export default abstract class Entity<Props> {
  private _id: UniqueEntityId
  protected props: Props

  get id() {
    return this._id
  }

  protected constructor(props: Props, id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId()
    this.props = props
  }

  public equals(entity: Entity<Props>): boolean {
    if (entity !== this) {
      return false
    }

    return entity.id === this._id
  }
}
