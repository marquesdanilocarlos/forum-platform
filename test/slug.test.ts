import Slug from '@/domain/forum/enterprise/entities/value-objects/slug'

test('Deve ser possível criar um slug a partir de um texto', () => {
  const slug = Slug.createFromText('Título exemplo de pergunta')

  expect(slug.value).toEqual('titulo-exemplo-de-pergunta')
})
