import InMemoryStudentsRepository from './repositories/in-memory-students-repository'
import FakeHasher from './cryptography/fake-hasher'
import Encrypter from '@/domain/forum/application/cryptography/encrypter'
import FakeEncrypter from './cryptography/fake-encrypter'
import StudentAuthenticate from '@/domain/forum/application/use-cases/student-authenticate'
import HashComparer from '@/domain/forum/application/cryptography/hash-comparer'
import makeStudent from './factories/make-student'

describe('Teste de autenticação de aluno', () => {
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let fakeHashComparer: HashComparer
  let fakeEncrypter: Encrypter
  let sut: StudentAuthenticate

  beforeEach(async () => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHashComparer = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new StudentAuthenticate(
      inMemoryStudentsRepository,
      fakeHashComparer,
      fakeEncrypter,
    )
  })

  it('Deve realizar a autenticação de um aluno', async () => {
    const student = makeStudent({
      email: 'jhondanilo@email.com',
      password: await fakeHashComparer.hash('123456'),
    })

    inMemoryStudentsRepository.students.push(student)

    const result = await sut.execute({
      email: 'jhondanilo@email.com',
      password: '123456',
    })

    expect(result.accessToken).toBeDefined()
    expect(result).toEqual({
      accessToken: expect.any(String),
    })
  })
})
