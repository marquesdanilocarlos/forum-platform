import Attachment, {
  AttachmentProps,
} from '@/domain/forum/enterprise/entities/attachment'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'

export default function makeAttachment(
  override: Partial<AttachmentProps> = {},
  id?: string,
): Attachment {
  return Attachment.create(
    {
      title: faker.lorem.slug(),
      url: faker.lorem.slug(),
      ...override,
    },
    new UniqueEntityId(id),
  )
}
